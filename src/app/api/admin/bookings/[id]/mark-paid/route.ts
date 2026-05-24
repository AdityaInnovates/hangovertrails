import { fail, ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { admin, response } = await requireAdmin();

  if (response) return response;

  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { payments: true } });

  if (!booking) return fail("BOOKING_NOT_FOUND", "Booking was not found.", 404);

  const unpaidPayments = booking.payments.filter((payment) => payment.status !== "PAID");

  await prisma.$transaction([
    ...unpaidPayments.map((payment) =>
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: "PAID", paidAt: new Date(), paidAmountCents: payment.dueAmountCents },
      }),
    ),
    prisma.booking.update({ where: { id }, data: { paymentStatus: "PAID" } }),
    prisma.auditLog.create({ data: { actorId: admin?.id, actorEmail: admin?.email, action: "BOOKING_MARKED_PAID", entityType: "Booking", entityId: id } }),
  ]);

  return ok({ updated: true });
}