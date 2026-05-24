import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { recordMockEmail } from "@/lib/mock-email";

type RouteContext = { params: Promise<{ id: string }> };

const cancelSchema = z.object({ reason: z.string().trim().min(3), refundAmountCents: z.number().int().min(0).default(0) });

export async function POST(request: Request, context: RouteContext) {
  const { admin, response } = await requireAdmin();

  if (response) return response;

  const { id } = await context.params;
  const body = cancelSchema.safeParse(await request.json().catch(() => null));

  if (!body.success) return fail("INVALID_CANCEL_PAYLOAD", "Cancellation reason is required.");

  const booking = await prisma.booking.update({
    where: { id },
    data: { bookingStatus: "CANCELLED", cancelledAt: new Date(), cancellationReason: body.data.reason, refundAmountCents: body.data.refundAmountCents, refundStatus: body.data.refundAmountCents > 0 ? "PENDING" : "NOT_APPLICABLE" },
  }).catch(() => null);

  if (!booking) return fail("BOOKING_NOT_FOUND", "Booking was not found.", 404);

  await prisma.auditLog.create({ data: { actorId: admin?.id, actorEmail: admin?.email, action: "BOOKING_CANCELLED", entityType: "Booking", entityId: id, metadata: body.data } });
  await recordMockEmail(id, booking.bookingCode, "BOOKING_CANCELLATION_SIMULATED_EMAIL");

  return ok({ booking });
}