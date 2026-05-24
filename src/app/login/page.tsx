import Image from "next/image";
import Link from "next/link";
import { Mountain, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata = {
  title: "Admin Login",
  description: "Secure admin login for the Arunachal Expedition CRM.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/admin";

  return (
    <main className="relative min-h-screen overflow-hidden bg-forest-deep px-4 py-6 text-white sm:px-6 lg:px-10">
      <Image
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85"
        alt="Mountain road background"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/68 via-forest-deep/56 to-black/45" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-white"
          >
            <Mountain className="size-4" aria-hidden="true" /> ArunachalRise
          </Link>
          <Link
            href="/"
            className="rounded-full bg-white/12 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white/18"
          >
            Public site
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1fr_460px]">
          <div className="max-w-3xl">
            <SectionLabel className="border-white/25 bg-white/12 text-white shadow-none">
              Admin CRM
            </SectionLabel>
            <h1 className="mt-7 font-display text-6xl font-semibold leading-tight sm:text-8xl">
              Operations for Every Expedition Detail
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/76">
              Manage trips, bookings, payments, expenses, stays, and itinerary
              planning from the same premium platform travelers see on the
              public site.
            </p>
          </div>

          <div className="glass-panel rounded-[2rem] p-6 text-foreground sm:p-8">
            <div className="mb-7 flex items-start gap-4">
              <span className="grid size-12 place-items-center rounded-2xl bg-forest text-white">
                <ShieldCheck className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-2xl font-bold">Sign in to CRM</h2>
                <p className="mt-1 text-sm leading-6 text-stone">
                  Local V1 uses seeded admin credentials for development.
                </p>
              </div>
            </div>
            <LoginForm nextPath={nextPath} />
          </div>
        </section>
      </div>
    </main>
  );
}
