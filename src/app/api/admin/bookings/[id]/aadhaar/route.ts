import { readFile } from "node:fs/promises";
import path from "node:path";
import { fail } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export const runtime = "nodejs";

export async function GET(_request: Request, context: RouteContext) {
  const { admin, response } = await requireAdmin();

  if (response) return response;

  const { id } = await context.params;
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) return fail("BOOKING_NOT_FOUND", "Booking was not found.", 404);

  const absolutePath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), booking.aadhaarFilePath);
  const file = await readFile(absolutePath).catch(() => null);

  if (!file) return fail("AADHAAR_FILE_NOT_FOUND", "The local Aadhaar file could not be found.", 404);

  await prisma.auditLog.create({
    data: {
      actorId: admin?.id,
      actorEmail: admin?.email,
      action: "AADHAAR_ACCESSED",
      entityType: "Booking",
      entityId: id,
      metadata: { bookingCode: booking.bookingCode, fileName: booking.aadhaarFileName },
    },
  });

  return new Response(file, {
    headers: {
      "Content-Type": booking.aadhaarMimeType,
      "Content-Disposition": `inline; filename="${booking.aadhaarFileName}"`,
      "Cache-Control": "no-store",
    },
  });
}