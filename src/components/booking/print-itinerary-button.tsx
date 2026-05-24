"use client";

import { Download } from "lucide-react";

export function PrintItineraryButton() {
  return (
    <button
      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-forest px-5 text-sm font-bold text-white"
      type="button"
      onClick={() => window.print()}
    >
      <Download className="size-4" aria-hidden="true" /> Download itinerary
    </button>
  );
}
