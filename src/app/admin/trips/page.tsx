import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { TripForm } from "@/components/admin/trip-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Trips",
  robots: { index: false, follow: false },
};

export default async function TripsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) redirect("/login?next=/admin/trips");

  const trips = await prisma.trip.findMany({
    include: { itineraryDays: true, bookings: true, expenses: true },
    orderBy: { location: "asc" },
  });

  return (
    <AdminShell
      active="/admin/trips"
      title="Trips"
      subtitle="Keep every listed journey accurate, bookable, and ready for the people choosing it."
    >
      <TripForm />
      <section className="mt-6 grid gap-5 xl:grid-cols-2">
        {trips.map((trip) => (
          <article
            key={trip.id}
            className="rounded-3xl border border-line bg-surface p-6 shadow-soft"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase text-stone">
                  {trip.tripCode} · {trip.location}
                </p>
                <h2 className="mt-2 text-2xl font-black">{trip.name}</h2>
              </div>
              <StatusBadge tone={trip.isActive ? "success" : "neutral"}>
                {trip.isActive ? "Active" : "Inactive"}
              </StatusBadge>
            </div>
            <div className="mt-6 grid gap-3 text-sm text-stone sm:grid-cols-4">
              <span>{trip.numberOfDays} days</span>
              <span>Max {trip.maxCapacity}</span>
              <span>{trip.itineraryDays.length} itinerary days</span>
              <span>{trip.bookings.length} bookings</span>
            </div>
            <Link
              href={`/tours/${trip.slug}`}
              className="mt-6 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-bold text-white"
            >
              View traveler page
            </Link>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
