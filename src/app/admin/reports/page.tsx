import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ChartCard } from "@/components/admin/chart-card";
import { getCurrentAdmin } from "@/lib/auth";
import { formatMoney, getDashboardData } from "@/lib/admin-data";

export const metadata = {
  title: "Reports",
  robots: { index: false, follow: false },
};

export default async function ReportsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) redirect("/login?next=/admin/reports");

  const dashboard = await getDashboardData();

  return (
    <AdminShell
      active="/admin/reports"
      title="Finance Reports"
      subtitle="Revenue, expenses, profit, and exportable booking data for local V1 operations."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-stone">Revenue</p>
          <p className="mt-2 text-3xl font-black">
            {formatMoney(dashboard.kpis.revenue)}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-stone">Expenses</p>
          <p className="mt-2 text-3xl font-black">
            {formatMoney(dashboard.kpis.expenseTotal)}
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-stone">Profit</p>
          <p className="mt-2 text-3xl font-black">
            {formatMoney(dashboard.kpis.profit)}
          </p>
        </article>
      </div>
      <div className="mt-6 rounded-3xl border border-line bg-surface p-6 shadow-soft">
        <a
          href="/api/admin/reports/export?format=csv"
          className="inline-flex rounded-full bg-forest px-5 py-3 text-sm font-bold text-white"
        >
          Export bookings CSV
        </a>
      </div>
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard
          title="Revenue Trend"
          type="line"
          data={dashboard.charts.revenueTrend}
        />
        <ChartCard
          title="Expense Breakdown"
          type="pie"
          data={dashboard.charts.expenseBreakdown}
        />
      </section>
    </AdminShell>
  );
}
