import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { recordMockEmail } from "@/lib/mock-email";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { response } = await requireAdmin();

  if (response) return response;

  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) return fail("BOOKING_NOT_FOUND", "Booking was not found.", 404);

  await recordMockEmail(id, booking.bookingCode, "BOOKING_CONFIRMATION_RESENT_SIMULATED_EMAIL");

  return ok({ resent: true, bookingCode: booking.bookingCode });
}