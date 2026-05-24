import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { BookingActions } from "@/components/admin/booking-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

type BookingsPageProps = {
  searchParams: Promise<{ status?: string; payment?: string; location?: string; q?: string }>;
};

function formatMoney(amountCents: number) {
  return `INR ${(amountCents / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export const metadata = {
  title: "Booking Management",
  robots: { index: false, follow: false },
};

export default async function AdminBookingsPage({ searchParams }: BookingsPageProps) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login?next=/admin/bookings");
  }

  const params = await searchParams;
  const bookings = await prisma.booking.findMany({
    where: {
      ...(params.status ? { bookingStatus: params.status } : {}),
      ...(params.payment ? { paymentStatus: params.payment } : {}),
      ...(params.location ? { trip: { location: params.location } } : {}),
      ...(params.q
        ? {
            OR: [
              { bookingCode: { contains: params.q } },
              { firstName: { contains: params.q } },
              { lastName: { contains: params.q } },
              { email: { contains: params.q } },
            ],
          }
        : {}),
    },
    include: { trip: true, group: true, payments: { orderBy: { installmentNumber: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <AdminShell active="/admin/bookings" title="Booking Management" subtitle="Search travelers, review payment state, access protected Aadhaar documents, and manage cancellation/payment actions.">
      <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
        <form className="grid gap-3 md:grid-cols-5">
          <input name="q" defaultValue={params.q} placeholder="Search booking, name, email" className="rounded-2xl border border-line bg-background px-4 py-3 text-sm md:col-span-2" />
          <select name="status" defaultValue={params.status ?? ""} className="rounded-2xl border border-line bg-background px-4 py-3 text-sm">
            <option value="">All booking statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select name="payment" defaultValue={params.payment ?? ""} className="rounded-2xl border border-line bg-background px-4 py-3 text-sm">
            <option value="">All payment states</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
          <button className="rounded-full bg-forest px-5 py-3 text-sm font-bold text-white" type="submit">Apply</button>
        </form>
      </section>

      <section className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-background text-xs uppercase text-stone">
              <tr>
                <th className="px-5 py-4">Booking</th>
                <th className="px-5 py-4">Traveler</th>
                <th className="px-5 py-4">Trip</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Document</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bookings.map((booking) => {
                const paid = booking.payments.reduce((total, payment) => total + payment.paidAmountCents, 0);

                return (
                  <tr key={booking.id}>
                    <td className="px-5 py-5">
                      <Link href={`/booking/${booking.bookingCode}`} className="font-black text-forest">{booking.bookingCode}</Link>
                      <p className="mt-1 text-xs text-stone">{booking.group?.groupBookingCode ?? booking.bookingType}</p>
                    </td>
                    <td className="px-5 py-5">
                      <p className="font-bold">{booking.firstName} {booking.lastName}</p>
                      <p className="text-xs text-stone">{booking.email}</p>
                    </td>
                    <td className="px-5 py-5">{booking.trip.name}</td>
                    <td className="px-5 py-5">
                      <p className="font-bold">{formatMoney(booking.bookingAmountCents)}</p>
                      <p className="text-xs text-stone">{formatMoney(paid)} paid</p>
                    </td>
                    <td className="px-5 py-5">
                      <div className="grid gap-2">
                        <StatusBadge tone={booking.paymentStatus === "PAID" ? "success" : "warning"}>{booking.paymentStatus}</StatusBadge>
                        <StatusBadge tone={booking.bookingStatus === "CANCELLED" ? "danger" : "success"}>{booking.bookingStatus}</StatusBadge>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <a href={`/api/admin/bookings/${booking.id}/aadhaar`} target="_blank" className="rounded-full bg-background px-4 py-2 text-xs font-bold text-foreground ring-1 ring-line" rel="noreferrer">
                        View Aadhaar
                      </a>
                    </td>
                    <td className="px-5 py-5">
                      <BookingActions bookingId={booking.id} bookingStatus={booking.bookingStatus} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}