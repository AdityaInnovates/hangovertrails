import { ok } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { response } = await requireAdmin();

  if (response) return response;

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 25), 100);
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const status = url.searchParams.get("status");
  const payment = url.searchParams.get("payment");
  const q = url.searchParams.get("q");

  const where = {
    ...(status ? { bookingStatus: status } : {}),
    ...(payment ? { paymentStatus: payment } : {}),
    ...(q
      ? {
          OR: [
            { bookingCode: { contains: q } },
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { trip: true, group: true, payments: true },
    }),
  ]);

  return ok({ bookings, pagination: { total, limit, offset } });
}
