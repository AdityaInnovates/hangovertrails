import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ExpenseForm } from "@/components/admin/expense-form";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = { title: "Expenses", robots: { index: false, follow: false } };

function formatMoney(amountCents: number) {
  return `INR ${(amountCents / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export default async function ExpensesPage() {
  const admin = await getCurrentAdmin();

  if (!admin) redirect("/login?next=/admin/expenses");

  const [trips, expenses] = await Promise.all([
    prisma.trip.findMany({ orderBy: { location: "asc" } }),
    prisma.expense.findMany({ include: { trip: true }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <AdminShell active="/admin/expenses" title="Expense Tracker" subtitle="Record local operating costs and keep profit reporting current.">
      <section className="rounded-3xl border border-line bg-surface p-5 shadow-soft">
        <ExpenseForm trips={trips.map((trip) => ({ id: trip.id, name: trip.name, location: trip.location }))} />
      </section>
      <section className="mt-6 overflow-hidden rounded-3xl border border-line bg-surface shadow-soft">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-background text-xs uppercase text-stone"><tr><th className="px-5 py-4">Trip</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Amount</th><th className="px-5 py-4">Notes</th></tr></thead>
          <tbody className="divide-y divide-line">
            {expenses.map((expense) => <tr key={expense.id}><td className="px-5 py-4 font-bold">{expense.trip.name}</td><td className="px-5 py-4">{expense.category}</td><td className="px-5 py-4">{formatMoney(expense.amountCents)}</td><td className="px-5 py-4 text-stone">{expense.notes ?? "-"}</td></tr>)}
          </tbody>
        </table>
      </section>
    </AdminShell>
  );
}