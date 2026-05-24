import { Suspense } from "react";
import Link from "next/link";
import { Mountain } from "lucide-react";
import { BookingForm } from "@/components/forms/booking-form";
import { SectionLabel } from "@/components/ui/section-label";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Book Your Tour",
  description:
    "Create a solo or group booking for a curated Arunachal expedition.",
};

export default async function BookPage() {
  const trips = await prisma.trip.findMany({
    where: { isActive: true },
    orderBy: [{ location: "asc" }, { basePriceCents: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
      numberOfDays: true,
      basePriceCents: true,
      maxCapacity: true,
      minBookingDaysInAdvance: true,
    },
  });

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest"
          >
            <Mountain className="size-4" aria-hidden="true" /> ArunachalRise
          </Link>
          <div className="mt-12">
            <SectionLabel>Booking Flow</SectionLabel>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-tight sm:text-7xl">
              Reserve Your Arunachal Expedition
            </h1>
            <p className="mt-5 text-base leading-8 text-stone">
              Tell us who is traveling, choose your dates, and upload the
              required ID document. We will keep the booking details organized
              so your trip can move from plan to departure smoothly.
            </p>
          </div>
        </aside>
        <Suspense
          fallback={
            <div className="rounded-3xl bg-surface p-8 shadow-soft">
              Loading booking form...
            </div>
          }
        >
          <BookingForm trips={trips} />
        </Suspense>
      </section>
    </main>
  );
}
