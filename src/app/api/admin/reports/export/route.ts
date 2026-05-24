import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  const { response } = await requireAdmin();

  if (response) return response;

  const bookings = await prisma.booking.findMany({ include: { trip: true, payments: true }, orderBy: { createdAt: "desc" } });
  const rows = [
    ["Booking ID", "Traveler", "Email", "Trip", "Location", "Booking Status", "Payment Status", "Amount", "Paid"],
    ...bookings.map((booking) => [
      booking.bookingCode,
      `${booking.firstName} ${booking.lastName}`,
      booking.email,
      booking.trip.name,
      booking.trip.location,
      booking.bookingStatus,
      booking.paymentStatus,
      booking.bookingAmountCents / 100,
      booking.payments.reduce((total, payment) => total + payment.paidAmountCents, 0) / 100,
    ]),
  ];
  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=arunachal-bookings-export.csv",
      "Cache-Control": "no-store",
    },
  });
}