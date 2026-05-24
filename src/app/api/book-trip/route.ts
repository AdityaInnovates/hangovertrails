import { fail, ok } from "@/lib/api-response";
import {
  generateBookingCode,
  generateGroupBookingCode,
} from "@/lib/booking-id";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { createInstallmentSchedule } from "@/lib/mock-payment";
import { recordMockEmail } from "@/lib/mock-email";
import { checkRateLimit } from "@/lib/rate-limit";
import { storeAadhaarFile } from "@/lib/uploads";
import { bookingRequestSchema, validateTripDates } from "@/lib/validators";

export const runtime = "nodejs";

function getClientIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(
    `booking:${ip}`,
    env.BOOKING_RATE_LIMIT_MAX,
    env.BOOKING_RATE_LIMIT_WINDOW_MINUTES,
  );

  if (!rateLimit.allowed) {
    return fail(
      "RATE_LIMITED",
      "Too many booking attempts. Please wait before trying again.",
      429,
    );
  }

  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return fail("INVALID_FORM_DATA", "Booking form data could not be read.");
  }

  const aadhaarFile = formData.get("aadhaarFile");

  if (!(aadhaarFile instanceof File) || aadhaarFile.size === 0) {
    return fail("AADHAAR_REQUIRED", "Aadhaar upload is required.");
  }

  const parsed = bookingRequestSchema.safeParse({
    firstName: formValue(formData, "firstName"),
    middleName: formValue(formData, "middleName"),
    lastName: formValue(formData, "lastName"),
    email: formValue(formData, "email"),
    address: formValue(formData, "address"),
    pin: formValue(formData, "pin"),
    phone: formValue(formData, "phone"),
    dob: formValue(formData, "dob"),
    gender: formValue(formData, "gender"),
    emergencyContact: formValue(formData, "emergencyContact"),
    consentGiven: formValue(formData, "consentGiven") === "true",
    bookingType: formValue(formData, "bookingType"),
    peopleCount: formValue(formData, "peopleCount"),
    tripId: formValue(formData, "tripId"),
    startDate: formValue(formData, "startDate"),
    endDate: formValue(formData, "endDate"),
  });

  if (!parsed.success) {
    return fail(
      "VALIDATION_FAILED",
      parsed.error.issues[0]?.message ?? "Booking details are invalid.",
    );
  }

  const input = parsed.data;
  const trip = await prisma.trip.findUnique({ where: { id: input.tripId } });

  if (!trip || !trip.isActive) {
    return fail("TRIP_NOT_FOUND", "Select an active trip package.", 404);
  }

  const dateError = validateTripDates(
    input.startDate,
    input.endDate,
    trip.numberOfDays,
    trip.minBookingDaysInAdvance,
  );

  if (dateError) {
    return fail("INVALID_TRIP_DATES", dateError);
  }

  const overlappingBookings = await prisma.booking.findMany({
    where: {
      tripId: trip.id,
      bookingStatus: { not: "CANCELLED" },
      startDate: { lte: input.endDate },
      endDate: { gte: input.startDate },
    },
    select: { peopleCount: true },
  });
  const bookedPeople = overlappingBookings.reduce(
    (total, booking) => total + booking.peopleCount,
    0,
  );

  if (bookedPeople + input.peopleCount > trip.maxCapacity) {
    return fail(
      "CAPACITY_EXCEEDED",
      `Only ${Math.max(trip.maxCapacity - bookedPeople, 0)} seats are available for this date range.`,
    );
  }

  const bookingCode = await generateBookingCode(
    trip,
    input.startDate,
    input.endDate,
    input.firstName,
  );

  let upload;
  try {
    upload = await storeAadhaarFile(aadhaarFile, bookingCode);
  } catch (error) {
    return fail(
      "UPLOAD_REJECTED",
      error instanceof Error ? error.message : "Aadhaar upload failed.",
    );
  }

  const totalAmountCents = trip.basePriceCents * input.peopleCount;
  const schedule = createInstallmentSchedule(totalAmountCents, input.startDate);

  const booking = await prisma.$transaction(async (tx) => {
    let groupId: string | undefined;

    if (input.bookingType === "GROUP") {
      const groupBookingCode = await generateGroupBookingCode(
        trip.tripCode,
        input.startDate,
        input.firstName,
      );
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const group = await tx.bookingGroup.create({
        data: {
          groupBookingCode,
          tripId: trip.id,
          startDate: input.startDate,
          endDate: input.endDate,
          groupSize: input.peopleCount,
          status: "OPEN",
          expiresAt,
        },
      });

      groupId = group.id;
    }

    return tx.booking.create({
      data: {
        bookingCode,
        groupId,
        tripId: trip.id,
        firstName: input.firstName,
        middleName: input.middleName || null,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        pin: input.pin,
        dob: input.dob,
        gender: input.gender,
        emergencyContact: input.emergencyContact || null,
        consentGiven: input.consentGiven,
        aadhaarFileName: upload.fileName,
        aadhaarFilePath: upload.filePath,
        aadhaarMimeType: upload.mimeType,
        aadhaarFileSize: upload.fileSize,
        bookingType: input.bookingType,
        peopleCount: input.peopleCount,
        startDate: input.startDate,
        endDate: input.endDate,
        bookingAmountCents: totalAmountCents,
        bookingStatus: "CONFIRMED",
        paymentStatus: schedule[1].dueAmountCents > 0 ? "PARTIAL" : "PAID",
        payments: { create: schedule },
      },
      include: {
        trip: true,
        payments: true,
        group: true,
      },
    });
  });

  await recordMockEmail(booking.id, booking.bookingCode);

  return ok({
    booking: {
      id: booking.id,
      bookingCode: booking.bookingCode,
      groupBookingCode: booking.group?.groupBookingCode ?? null,
      tripName: booking.trip.name,
      paymentStatus: booking.paymentStatus,
      bookingStatus: booking.bookingStatus,
      totalAmountCents: booking.bookingAmountCents,
      paidAmountCents: booking.payments.reduce(
        (total, payment) => total + payment.paidAmountCents,
        0,
      ),
    },
  });
}
