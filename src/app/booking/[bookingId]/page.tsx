import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Mail,
  Mountain,
} from "lucide-react";
import { PrintItineraryButton } from "@/components/booking/print-itinerary-button";
import { SectionLabel } from "@/components/ui/section-label";
import { StatusBadge } from "@/components/ui/status-badge";
import { prisma } from "@/lib/db";

type BookingConfirmationProps = {
  params: Promise<{ bookingId: string }>;
};

function formatCurrency(amountCents: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amountCents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({ params }: BookingConfirmationProps) {
  const { bookingId } = await params;

  return {
    title: `Booking ${bookingId}`,
    description: "Booking confirmation and itinerary status.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function BookingConfirmationPage({
  params,
}: BookingConfirmationProps) {
  const { bookingId } = await params;
  const booking = await prisma.booking.findUnique({
    where: { bookingCode: decodeURIComponent(bookingId) },
    include: {
      group: true,
      payments: { orderBy: { installmentNumber: "asc" } },
      trip: {
        include: {
          itineraryDays: { orderBy: { dayNumber: "asc" } },
        },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const paidAmount = booking.payments.reduce(
    (total, payment) => total + payment.paidAmountCents,
    0,
  );
  const pendingAmount = booking.bookingAmountCents - paidAmount;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-forest"
        >
          <Mountain className="size-4" aria-hidden="true" /> ArunachalRise
        </Link>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-[2rem] border border-line bg-surface p-6 shadow-soft sm:p-8">
            <SectionLabel>Booking Confirmed</SectionLabel>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="font-display text-6xl font-semibold leading-tight">
                  {booking.trip.name}
                </h1>
                <p className="mt-4 text-base leading-8 text-stone">
                  Booking ID{" "}
                  <span className="font-bold text-foreground">
                    {booking.bookingCode}
                  </span>
                  {booking.group?.groupBookingCode ? (
                    <>
                      {" "}
                      · Group ID{" "}
                      <span className="font-bold text-foreground">
                        {booking.group.groupBookingCode}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
              <StatusBadge tone="success">{booking.bookingStatus}</StatusBadge>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-background p-5">
                <p className="text-sm font-bold text-stone">Traveler</p>
                <p className="mt-2 text-lg font-black">
                  {booking.firstName} {booking.lastName}
                </p>
              </div>
              <div className="rounded-3xl bg-background p-5">
                <p className="text-sm font-bold text-stone">Dates</p>
                <p className="mt-2 text-lg font-black">
                  {formatDate(booking.startDate)} -{" "}
                  {formatDate(booking.endDate)}
                </p>
              </div>
              <div className="rounded-3xl bg-background p-5">
                <p className="text-sm font-bold text-stone">Travelers</p>
                <p className="mt-2 text-lg font-black">{booking.peopleCount}</p>
              </div>
            </div>

            <section className="mt-10">
              <h2 className="text-2xl font-bold">Itinerary</h2>
              <div className="mt-5 grid gap-4">
                {booking.trip.itineraryDays.map((day) => (
                  <article
                    key={day.id}
                    className="rounded-3xl border border-line bg-background p-5"
                  >
                    <StatusBadge>Day {day.dayNumber}</StatusBadge>
                    <h3 className="mt-3 text-xl font-bold">{day.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone">
                      Stay: {day.stayLocation}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[2rem] border border-line bg-surface p-6 shadow-soft lg:sticky lg:top-8">
            <div className="flex items-center gap-3">
              <CheckCircle2
                className="size-6 text-success"
                aria-hidden="true"
              />
              <div>
                <p className="font-bold">Local booking created</p>
                <p className="text-sm text-stone">
                  Stored in PostgreSQL CRM data.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl bg-background p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-stone">
                  <CreditCard className="size-4" /> Payment
                </p>
                <p className="mt-2 text-2xl font-black">
                  {formatCurrency(paidAmount)} paid
                </p>
                <p className="mt-1 text-sm text-stone">
                  {formatCurrency(pendingAmount)} pending
                </p>
              </div>
              <div className="rounded-3xl bg-background p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-stone">
                  <Mail className="size-4" /> Email
                </p>
                <p className="mt-2 text-sm leading-6 text-stone">
                  Confirmation email is simulated in the local audit log for V1.
                </p>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <PrintItineraryButton />
              <Link
                href="/destinations"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-bold text-foreground ring-1 ring-line"
              >
                Explore more routes
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
