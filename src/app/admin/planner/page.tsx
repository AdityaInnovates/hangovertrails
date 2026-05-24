import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Planner", robots: { index: false, follow: false } };

export default async function PlannerPage() {
  const admin = await getCurrentAdmin();

  if (!admin) redirect("/login?next=/admin/planner");

  const bookings = await prisma.booking.findMany({ include: { trip: true }, orderBy: { startDate: "asc" }, take: 40 });

  return (
    <AdminShell active="/admin/planner" title="Trip Planner" subtitle="Location-specific planning board with payment status colors for daily operations.">
      <section className="grid gap-4">
        <div className="flex flex-wrap gap-3 rounded-3xl border border-line bg-surface p-5 shadow-soft">
          <StatusBadge tone="success">Green: Paid</StatusBadge>
          <StatusBadge tone="warning">Orange: Partial/Pending</StatusBadge>
          <StatusBadge tone="danger">Red: Cancelled</StatusBadge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {bookings.map((booking) => (
            <article key={booking.id} className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase text-stone">{booking.trip.location}</p>
                  <h2 className="mt-1 text-xl font-bold">{booking.bookingCode}</h2>
                  <p className="mt-2 text-sm text-stone">{booking.startDate.toLocaleDateString("en-IN")} - {booking.endDate.toLocaleDateString("en-IN")}</p>
                </div>
                <StatusBadge tone={booking.bookingStatus === "CANCELLED" ? "danger" : booking.paymentStatus === "PAID" ? "success" : "warning"}>{booking.paymentStatus}</StatusBadge>
              </div>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}