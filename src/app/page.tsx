import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Mountain,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/section-label";
import { StatusBadge } from "@/components/ui/status-badge";
import { getDestinations, getTrips } from "@/lib/public-data";
import { cn } from "@/lib/utils";

const formatCurrency = (amountCents: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);

const bookingSteps = [
  {
    title: "Choose a Package",
    description: "Find the route, pace, and landscape that match the trip you have in mind.",
  },
  {
    title: "Submit Traveler Details",
    description:
      "Share the essentials once so your stay, transport, and documents are ready before departure.",
  },
  {
    title: "Confirm Installment",
    description:
      "Reserve your seat with a clear deposit and balance schedule.",
  },
  {
    title: "Track Your Itinerary",
    description:
      "Keep your confirmation, dates, and day-wise plan easy to revisit.",
  },
];

const testimonials = [
  {
    name: "Ari Putri",
    role: "Culture traveler",
    quote:
      "The itinerary felt personal, calm, and beautifully paced from the first pickup.",
  },
  {
    name: "Ricky Aditya",
    role: "Group organizer",
    quote:
      "Group documents, payments, and stays finally had one clean place to live.",
  },
  {
    name: "Nisha Nath",
    role: "Solo explorer",
    quote:
      "The visual detail made it easy to understand what every day would feel like.",
  },
];

export default async function Home() {
  const [destinations, trips] = await Promise.all([
    getDestinations(),
    getTrips(undefined, 4),
  ]);
  const heroTrip = trips[0];

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="px-4 pt-6 sm:px-6 lg:px-10">
        <div className="relative mx-auto min-h-[720px] max-w-7xl overflow-hidden rounded-[2rem] bg-forest-deep text-white shadow-glass">
          <Image
            src={heroTrip?.heroImageUrl ?? destinations[0].imageUrl}
            alt="Arunachal mountain expedition landscape"
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/70" />

          <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-white"
            >
              <span className="grid size-8 place-items-center rounded-full bg-white/18 ring-1 ring-white/40 backdrop-blur">
                <Mountain className="size-4" aria-hidden="true" />
              </span>
              ArunachalRise
            </Link>
            <nav className="hidden items-center gap-1 rounded-full bg-white/16 px-2 py-2 text-xs font-semibold ring-1 ring-white/25 backdrop-blur-md md:flex">
              {[
                "Destinations",
                "Packages",
                "Gallery",
                "How it works",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
                  className="rounded-full px-4 py-2 text-white/82 transition hover:bg-white/16 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </nav>
            <Link
              href="/book"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-forest-deep shadow-soft transition hover:bg-surface-muted"
            >
              Book now
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </header>

          <div className="relative z-10 mx-auto flex min-h-[600px] max-w-5xl flex-col items-center justify-center px-5 text-center">
            <SectionLabel className="border-white/25 bg-white/12 text-white shadow-none">
              Curated Arunachal Expeditions
            </SectionLabel>
            <h1 className="mt-8 max-w-4xl font-display text-6xl font-semibold leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              Unforgettable Arunachal Journeys, Planned End to End
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/82 sm:text-lg">
              Thoughtfully paced routes through Tawang, Ziro, Mechuka, and
              Anini, with bookings, stays, transport, and documents handled
              before you set out.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 px-5 pb-6 md:grid-cols-[1.1fr_1.5fr] md:px-8">
            <div className="glass-panel rounded-3xl p-5 text-forest-deep">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {destinations.slice(0, 3).map((destination) => (
                    <Image
                      key={destination.name}
                      src={destination.imageUrl}
                      alt={`${destination.name} landscape`}
                      width={44}
                      height={44}
                      className="size-11 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold">Four curated destinations</p>
                  <p className="text-xs text-stone">
                    Carefully selected routes for first-time and returning travelers.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {trips.slice(0, 3).map((trip, index) => (
                <Link
                  key={trip.id}
                  href={`/tours/${trip.slug}`}
                  className={cn(
                    "group relative min-h-44 overflow-hidden rounded-3xl bg-black text-white shadow-soft",
                    index === 0 && "sm:min-h-56",
                  )}
                >
                  <Image
                    src={trip.cardImageUrl}
                    alt={trip.name}
                    fill
                    sizes="(max-width: 768px) 90vw, 260px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-sm font-bold">{trip.name}</p>
                    <p className="mt-1 text-xs text-white/75">
                      {trip.numberOfDays} days ·{" "}
                      {formatCurrency(trip.basePriceCents)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="destinations"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Base Adventures</SectionLabel>
          <h2 className="mt-6 font-display text-5xl font-semibold leading-tight text-foreground sm:text-6xl">
            Four Ways to Meet Arunachal Closely
          </h2>
          <p className="mt-5 text-base leading-8 text-stone">
            Choose snow-line monasteries, music-filled valleys, remote river
            roads, or highland wilderness. Each journey is planned with the
            practical details already in view.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {destinations.map((destination, index) => (
            <Link
              key={destination.name}
              href={`/destinations/${destination.slug}`}
              className={cn(
                "group relative min-h-80 overflow-hidden rounded-3xl bg-forest-deep text-white shadow-soft",
                index % 2 === 1 && "md:mt-10",
              )}
            >
              <Image
                src={destination.imageUrl}
                alt={`${destination.name} destination`}
                fill
                sizes="(max-width: 768px) 90vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <StatusBadge className="bg-white/18 text-white ring-white/25">
                  {destination.tripCount} active trip
                  {destination.tripCount === 1 ? "" : "s"}
                </StatusBadge>
                <h3 className="mt-4 font-display text-4xl font-semibold">
                  {destination.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  {destination.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="packages" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-end">
            <div>
              <SectionLabel>Featured Tours</SectionLabel>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-tight sm:text-6xl">
                Discover the Best Arunachal Adventures for Every Traveler
              </h2>
              <p className="mt-5 text-base leading-8 text-stone">
                Compare journeys by pace, price, duration, and destination so
                you can choose with confidence.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {trips.map((trip) => (
                <article
                  key={trip.id}
                  className="overflow-hidden rounded-3xl border border-line bg-background shadow-soft"
                >
                  <div className="relative h-56">
                    <Image
                      src={trip.cardImageUrl}
                      alt={trip.name}
                      fill
                      sizes="(max-width: 768px) 90vw, 360px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3 text-xs font-bold uppercase text-stone">
                      <span>{trip.location}</span>
                      <span>{trip.numberOfDays} days</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-foreground">
                      {trip.name}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone">
                      {trip.itineraryDays
                        .map((day) => day.stayLocation)
                        .join(" · ")}
                    </p>
                    <div className="mt-5 flex items-center justify-between gap-4">
                      <p className="font-bold text-forest">
                        {formatCurrency(trip.basePriceCents)}{" "}
                        <span className="text-xs font-semibold text-stone">
                          / person
                        </span>
                      </p>
                      <Link
                        href={`/tours/${trip.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-xs font-bold text-white transition hover:bg-forest-deep"
                      >
                        View trip
                        <ArrowRight className="size-3.5" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="gallery"
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Captured Moments</SectionLabel>
          <h2 className="mt-6 font-display text-5xl font-semibold leading-tight sm:text-6xl">
            Trips That Feel Clear Before They Begin
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-3xl border border-line bg-surface p-6 shadow-soft"
            >
              <Sparkles className="size-5 text-sunrise" aria-hidden="true" />
              <p className="mt-5 text-lg leading-8 text-foreground">
                “{testimonial.quote}”
              </p>
              <div className="mt-8">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-stone">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-foreground py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <SectionLabel className="border-white/15 bg-white/8 text-white">
                How to Book
              </SectionLabel>
              <h2 className="mt-6 font-display text-5xl font-semibold leading-tight sm:text-7xl">
                Book Your Tour in Four Clean Steps
              </h2>
              <p className="mt-5 text-base leading-8 text-white/70">
                From the first route choice to the final confirmation, every
                step is kept simple, transparent, and easy to return to.
              </p>
            </div>
            <div className="grid gap-4">
              {bookingSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="grid grid-cols-[auto_1fr] gap-4 rounded-3xl bg-white/8 p-5 ring-1 ring-white/10"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-sunrise text-sm font-black text-forest-deep">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-white/68">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-forest-deep px-6 py-24 text-center text-white shadow-glass">
          <Image
            src={destinations[0].imageUrl}
            alt="Arunachal valley at sunrise"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest-deep/62" />
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="font-display text-5xl font-semibold leading-tight sm:text-7xl">
              Experience Arunachal With a Platform Built for the Whole Journey
            </h2>
            <p className="mt-5 text-base leading-8 text-white/76">
              Browse the routes, choose your dates, and reserve a place on an
              Arunachal journey that is prepared before you arrive.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/book"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-forest-deep transition hover:bg-surface-muted"
              >
                Start booking
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white/12 px-6 text-sm font-bold text-white ring-1 ring-white/25 transition hover:bg-white/18"
              >
                Admin login
                <ShieldCheck className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-4 text-sm text-stone sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-10"
      >
        <div>
          <div className="inline-flex items-center gap-2 font-bold text-foreground">
            <Mountain className="size-5 text-forest" aria-hidden="true" />
            ArunachalRise
          </div>
          <p className="mt-4 max-w-md leading-7">
            Guided Arunachal travel with clear itineraries, responsible route
            planning, and booking support from inquiry to departure.
          </p>
        </div>
        <div>
          <p className="font-bold text-foreground">Operations</p>
          <div className="mt-4 grid gap-3">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" /> Date-led
              trip planning
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="size-4" aria-hidden="true" /> Group travel ready
            </span>
          </div>
        </div>
        <div>
          <p className="font-bold text-foreground">Contact</p>
          <div className="mt-4 grid gap-3">
            <span>hello@arunachalrise.in</span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" /> Arunachal
              Pradesh, India
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
