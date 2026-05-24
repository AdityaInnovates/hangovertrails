import { redirect } from "next/navigation";
import {
  CalendarDays,
  IndianRupee,
  Map,
  Receipt,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ChartCard } from "@/components/admin/chart-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentAdmin } from "@/lib/auth";
import { formatMoney, getDashboardData } from "@/lib/admin-data";

export const metadata = {
  title: "Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/login?next=/admin");
  }

  const dashboard = await getDashboardData();

  const stats = [
    {
      label: "Total Revenue",
      value: formatMoney(dashboard.kpis.revenue),
      icon: IndianRupee,
      tone: "success",
    },
    {
      label: "Total Profit",
      value: formatMoney(dashboard.kpis.profit),
      icon: TrendingUp,
      tone: dashboard.kpis.profit >= 0 ? "success" : "danger",
    },
    {
      label: "Total Expenses",
      value: formatMoney(dashboard.kpis.expenseTotal),
      icon: Receipt,
      tone: "warning",
    },
    {
      label: "Active Trips",
      value: dashboard.kpis.activeTrips.toString(),
      icon: Map,
      tone: "neutral",
    },
    {
      label: "Pending Payments",
      value: formatMoney(dashboard.kpis.pendingPayments),
      icon: WalletCards,
      tone: "warning",
    },
    {
      label: "Completed Trips",
      value: dashboard.kpis.completedTrips.toString(),
      icon: CalendarDays,
      tone: "neutral",
    },
    {
      label: "Monthly Bookings",
      value: dashboard.kpis.monthlyBookingCount.toString(),
      icon: Users,
      tone: "neutral",
    },
    {
      label: "Average Booking",
      value: formatMoney(dashboard.kpis.averageBookingValue),
      icon: IndianRupee,
      tone: "neutral",
    },
  ];

  return (
    <AdminShell
      title={`Welcome, ${admin.name}`}
      subtitle="Start with the numbers that need attention today: bookings, payments, expenses, and trip capacity."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-3xl border border-line bg-surface p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <Icon className="size-5 text-sunrise" aria-hidden="true" />
                <StatusBadge
                  tone={
                    stat.tone as "success" | "warning" | "danger" | "neutral"
                  }
                >
                  {stat.label}
                </StatusBadge>
              </div>
              <p className="mt-5 text-2xl font-black text-foreground">
                {stat.value}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue Trend"
          type="line"
          data={dashboard.charts.revenueTrend}
        />
        <ChartCard
          title="Monthly Bookings"
          type="bar"
          data={dashboard.charts.monthlyBookings}
        />
        <ChartCard
          title="Location Popularity"
          type="bar"
          data={dashboard.charts.locationPopularity}
        />
        <ChartCard
          title="Expense Breakdown"
          type="pie"
          data={dashboard.charts.expenseBreakdown}
        />
      </section>

      <section className="mt-6 rounded-3xl border border-line bg-surface p-6 shadow-soft">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            <p className="mt-1 text-sm text-stone">
              The newest travelers waiting for review, payment follow-up, or trip preparation.
            </p>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase text-stone">
              <tr>
                <th className="py-3 pr-4">Booking ID</th>
                <th className="py-3 pr-4">Traveler</th>
                <th className="py-3 pr-4">Trip</th>
                <th className="py-3 pr-4">Payment</th>
                <th className="py-3 pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {dashboard.recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="py-4 pr-4 font-bold">{booking.bookingCode}</td>
                  <td className="py-4 pr-4">
                    {booking.firstName} {booking.lastName}
                  </td>
                  <td className="py-4 pr-4">{booking.trip.name}</td>
                  <td className="py-4 pr-4">
                    <StatusBadge
                      tone={
                        booking.paymentStatus === "PAID" ? "success" : "warning"
                      }
                    >
                      {booking.paymentStatus}
                    </StatusBadge>
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge
                      tone={
                        booking.bookingStatus === "CANCELLED"
                          ? "danger"
                          : "success"
                      }
                    >
                      {booking.bookingStatus}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
