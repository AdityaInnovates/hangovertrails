"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BookingActions({
  bookingId,
  bookingStatus,
}: {
  bookingId: string;
  bookingStatus: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function post(path: string, body?: unknown) {
    setMessage(null);
    setLoading(path);
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const result = await response.json();
    setLoading(null);

    if (!result.success) {
      setMessage(result.error.message);
      return;
    }

    setMessage("Updated");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        size="sm"
        variant="secondary"
        loading={loading?.includes("resend")}
        onClick={() =>
          post(`/api/admin/bookings/${bookingId}/resend-confirmation`)
        }
      >
        Resend
      </Button>
      <Button
        size="sm"
        variant="secondary"
        loading={loading?.includes("mark-paid")}
        onClick={() => post(`/api/admin/bookings/${bookingId}/mark-paid`)}
      >
        Mark paid
      </Button>
      {bookingStatus !== "CANCELLED" ? (
        <Button
          size="sm"
          variant="danger"
          loading={loading?.includes("cancel")}
          onClick={() =>
            post(`/api/admin/bookings/${bookingId}/cancel`, {
              reason: "Admin cancelled from CRM",
              refundAmountCents: 0,
            })
          }
        >
          Cancel
        </Button>
      ) : null}
      {message ? (
        <span className="text-xs font-bold text-stone">{message}</span>
      ) : null}
    </div>
  );
}
