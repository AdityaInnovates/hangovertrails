import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mountain } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDestinations, getTrips } from "@/lib/public-data";

export const metadata = {
  title: "Destinations",
  description: "Explore Tawang, Ziro, Mechuka, and Anini expedition routes.",
};

export default async function DestinationsPage() {
  const [destinations, trips] = await Promise.all([
    getDestinations(),
    getTrips(undefined, 12),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest"
          >
            <Mountain className="size-4" aria-hidden="true" /> ArunachalRise
          </Link>
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <SectionLabel>Destinations</SectionLabel>
              <h1 className="mt-6 font-display text-6xl font-semibold leading-tight sm:text-7xl">
                Four Curated Arunachal Regions
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-8 text-stone">
              Start with the region that calls to you: monastery roads,
              pine-covered valleys, riverside settlements, or quiet highlands
              close to the edge of the map.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-24 sm:px-6 md:grid-cols-2 lg:px-10">
        {destinations.map((destination) => {
          const destinationTrips = trips.filter(
            (trip) => trip.location === destination.name,
          );

          return (
            <Link
              key={destination.name}
              href={`/destinations/${destination.slug}`}
              className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-forest-deep text-white shadow-glass"
            >
              <Image
                src={destination.imageUrl}
                alt={`${destination.name} landscape`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <StatusBadge className="bg-white/18 text-white ring-white/25">
                  {destinationTrips.length} package
                  {destinationTrips.length === 1 ? "" : "s"}
                </StatusBadge>
                <h2 className="mt-5 font-display text-5xl font-semibold">
                  {destination.name}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/78">
                  {destination.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                  View route
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
