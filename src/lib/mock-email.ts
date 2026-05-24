import { prisma } from "@/lib/db";

export async function recordMockEmail(entityId: string, bookingCode: string, action = "BOOKING_CONFIRMATION_SIMULATED_EMAIL") {
  return prisma.auditLog.create({
    data: {
      actorEmail: "system",
      action,
      entityType: "Booking",
      entityId,
      metadata: {
        bookingCode,
        channel: "local-mock",
        message: "Confirmation email simulated locally.",
      },
    },
  });
}