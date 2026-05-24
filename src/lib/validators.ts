import { z } from "zod";
import { BOOKING_TYPES, GENDERS } from "@/lib/domain";

const plainText = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine((value) => !/[<>]/.test(value), "HTML characters are not allowed");

export const bookingRequestSchema = z.object({
  firstName: plainText.max(80),
  middleName: z.string().trim().max(80).optional(),
  lastName: plainText.max(80),
  email: z.string().trim().toLowerCase().email(),
  address: plainText.max(500),
  pin: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "PIN must be 6 digits"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+91)?[6-9]\d{9}$/, "Enter a valid Indian phone number"),
  dob: z.coerce.date(),
  gender: z.enum(GENDERS),
  emergencyContact: z
    .string()
    .trim()
    .regex(/^(\+91)?[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),
  consentGiven: z.coerce.boolean().refine(Boolean, "Consent is required"),
  bookingType: z.enum(BOOKING_TYPES),
  peopleCount: z.coerce.number().int().min(1).max(30),
  tripId: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export function validateTripDates(
  startDate: Date,
  endDate: Date,
  numberOfDays: number,
  minBookingDaysInAdvance: number,
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const earliestStart = new Date(today);
  earliestStart.setDate(today.getDate() + minBookingDaysInAdvance);

  if (startDate < earliestStart) {
    return `Start date must be at least ${minBookingDaysInAdvance} days from today.`;
  }

  const expectedEnd = new Date(startDate);
  expectedEnd.setDate(startDate.getDate() + numberOfDays - 1);

  if (endDate.toDateString() !== expectedEnd.toDateString()) {
    return `End date must match the ${numberOfDays}-day itinerary.`;
  }

  return null;
}
