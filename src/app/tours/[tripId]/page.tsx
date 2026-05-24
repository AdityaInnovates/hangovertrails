import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  IndianRupee,
  Mountain,
  Users,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { StatusBadge } from "@/components/ui/status-badge";
import { getTripByIdOrSlug } from "@/lib/public-data";

type TourPageProps = {
  params: Promise<{ tripId: string }>;
};

const formatCurrency = (amountCents: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);

export async function generateMetadata({ params }: TourPageProps) {
  const { tripId } = await params;
  const trip = await getTripByIdOrSlug(tripId);

  return {
    title: trip ? trip.name : "Tour",
    description: trip
      ? `${trip.numberOfDays}-day ${trip.location} itinerary.`
      : "Arunachal expedition tour details.",
  };
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const { tripId } = await params;
  const trip = await getTripByIdOrSlug(tripId);

  if (!trip) {
    notFound();
  }

  const inclusions = Array.isArray(trip.inclusions) ? trip.inclusions : [];
  const exclusions = Array.isArray(trip.exclusions) ? trip.exclusions : [];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="px-4 pt-6 sm:px-6 lg:px-10">
        <div className="relative mx-auto min-h-[620px] max-w-7xl overflow-hidden rounded-[2rem] bg-forest-deep text-white shadow-glass">
          <Image
            src={trip.heroImageUrl}
            alt={trip.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-black/25" />
          <div className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-white"
            >
              <Mountain className="size-4" aria-hidden="true" /> ArunachalRise
            </Link>
            <Link
              href={`/book?trip=${trip.slug}`}
              className="rounded-full bg-white px-4 py-2 text-xs font-bold text-forest-deep"
            >
              Book this tour
            </Link>
          </div>
          <div className="relative z-10 flex min-h-[490px] max-w-5xl flex-col justify-end px-6 pb-10 sm:px-10">
            <SectionLabel className="border-white/25 bg-white/12 text-white shadow-none">
              {trip.location}
            </SectionLabel>
            <h1 className="mt-6 font-display text-6xl font-semibold leading-tight sm:text-8xl">
              {trip.name}
            </h1>
            <div className="mt-8 grid gap-3 text-sm font-bold sm:grid-cols-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-3 ring-1 ring-white/16">
                <CalendarDays className="size-4" /> {trip.numberOfDays} days
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-3 ring-1 ring-white/16">
                <Users className="size-4" /> Up to {trip.maxCapacity}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/14 px-4 py-3 ring-1 ring-white/16">
                <IndianRupee className="size-4" />{" "}
                {formatCurrency(trip.basePriceCents)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.25fr_0.75fr] lg:px-10">
        <div>
          <SectionLabel>Day-wise Itinerary</SectionLabel>
          <div className="mt-8 grid gap-5">
            {trip.itineraryDays.map((day) => (
              <article
                key={day.id}
                className="grid gap-5 rounded-3xl border border-line bg-surface p-4 shadow-soft sm:grid-cols-[180px_1fr]"
              >
                <div className="relative min-h-44 overflow-hidden rounded-2xl">
                  <Image
                    src={day.imageUrl}
                    alt={day.title}
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                </div>
                <div className="py-2">
                  <StatusBadge>Day {day.dayNumber}</StatusBadge>
                  <h2 className="mt-3 text-2xl font-bold">{day.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone">
                    Stay: {day.stayLocation}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-stone">
                    {day.notes}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-line bg-surface p-6 shadow-soft lg:sticky lg:top-6">
          <p className="text-sm font-bold uppercase text-stone">
            Starting from
          </p>
          <p className="mt-2 font-display text-5xl font-semibold text-forest">
            {formatCurrency(trip.basePriceCents)}
          </p>
          <p className="mt-2 text-sm text-stone">
            per person, GST {trip.gstIncluded ? "included" : "excluded"}
          </p>
          <Link
            href={`/book?trip=${trip.slug}`}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-forest px-6 text-sm font-bold text-white transition hover:bg-forest-deep"
          >
            Start booking
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <div className="mt-8 grid gap-6">
            <div>
              <h3 className="font-bold">Inclusions</h3>
              <ul className="mt-3 grid gap-2 text-sm text-stone">
                {inclusions.map((item) => (
                  <li key={String(item)} className="flex gap-2">
                    <Check className="mt-0.5 size-4 text-success" />{" "}
                    {String(item)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Exclusions</h3>
              <ul className="mt-3 grid gap-2 text-sm text-stone">
                {exclusions.map((item) => (
                  <li key={String(item)}>{String(item)}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
