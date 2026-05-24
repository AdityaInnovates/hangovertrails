"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type TripOption = { id: string; name: string; location: string };

export function ExpenseForm({ trips }: { trips: TripOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const response = await fetch("/api/admin/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tripId: formData.get("tripId"),
        category: formData.get("category"),
        amount: formData.get("amount"),
        notes: formData.get("notes"),
      }),
    });
    const result = await response.json();
    setLoading(false);

    if (!result.success) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Expense recorded");
    router.refresh();
  }

  return (
    <form action={submit} className="grid gap-3 md:grid-cols-5">
      <select name="tripId" className="rounded-2xl border border-line bg-background px-4 py-3 text-sm md:col-span-2" required>
        {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.location} - {trip.name}</option>)}
      </select>
      <input name="category" placeholder="Category" className="rounded-2xl border border-line bg-background px-4 py-3 text-sm" required />
      <input name="amount" type="number" min="1" step="0.01" placeholder="Amount" className="rounded-2xl border border-line bg-background px-4 py-3 text-sm" required />
      <Button type="submit" loading={loading}>Add expense</Button>
      <input name="notes" placeholder="Notes" className="rounded-2xl border border-line bg-background px-4 py-3 text-sm md:col-span-4" />
      {message ? <p className="text-xs font-bold text-stone">{message}</p> : null}
    </form>
  );
}