import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Mountain } from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { getDestinationBySlug, getTrips, isLocation } from "@/lib/public-data";

type DestinationPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  return {
    title: destination ? destination.name : "Destination",
    description:
      destination?.description ?? "Explore Arunachal expedition destinations.",
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationPageProps) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination || !isLocation(destination.name)) {
    notFound();
  }

  const trips = await getTrips(destination.name, 8);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-4 pt-6 sm:px-6 lg:px-10">
        <div className="relative mx-auto min-h-[560px] max-w-7xl overflow-hidden rounded-[2rem] bg-forest-deep text-white shadow-glass">
          <Image
            src={destination.imageUrl}
            alt={`${destination.name} route`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-black/20" />
          <div className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-white"
            >
              <Mountain className="size-4" aria-hidden="true" /> ArunachalRise
            </Link>
            <Link
              href="/book"
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-forest-deep"
            >
              Book now
            </Link>
          </div>
          <div className="relative z-10 flex min-h-[430px] max-w-4xl flex-col justify-end px-6 pb-10 sm:px-10">
            <SectionLabel className="border-white/25 bg-white/12 text-white shadow-none">
              {destination.name}
            </SectionLabel>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-tight sm:text-8xl">
              {destination.name} Expeditions
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/78">
              {destination.description}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>Packages</SectionLabel>
            <h2 className="mt-6 font-display text-5xl font-semibold leading-tight">
              Available {destination.name} Tours
            </h2>
            <p className="mt-5 text-base leading-8 text-stone">
              Each package carries itinerary, capacity, pricing, and operational
              data for the CRM.
            </p>
          </div>
          <div className="grid gap-5">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/tours/${trip.slug}`}
                className="grid gap-5 overflow-hidden rounded-3xl border border-line bg-surface p-4 shadow-soft sm:grid-cols-[220px_1fr]"
              >
                <div className="relative min-h-52 overflow-hidden rounded-2xl">
                  <Image
                    src={trip.cardImageUrl}
                    alt={trip.name}
                    fill
                    sizes="220px"
                    className="object-cover"
                  />
                </div>
                <div className="py-2">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-stone">
                    <MapPin className="size-3.5" aria-hidden="true" />{" "}
                    {trip.location} · {trip.numberOfDays} days
                  </span>
                  <h3 className="mt-3 text-2xl font-bold">{trip.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone">
                    Capacity up to {trip.maxCapacity} travelers. Starts from INR{" "}
                    {(trip.basePriceCents / 100).toLocaleString("en-IN")} per
                    person.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-bold text-white">
                    View itinerary
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
