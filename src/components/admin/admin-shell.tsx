import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LayoutDashboard,
  Mountain,
  Receipt,
  Settings,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: FileText },
  { href: "/admin/trips", label: "Trips", icon: BriefcaseBusiness },
  { href: "/admin/planner", label: "Planner", icon: CalendarDays },
  { href: "/admin/expenses", label: "Expenses", icon: Receipt },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  children,
  active = "/admin",
  title,
  subtitle,
}: {
  children: React.ReactNode;
  active?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-line bg-forest-deep p-4 text-white lg:border-b-0 lg:border-r lg:border-white/10 lg:p-6">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link href="/" className="inline-flex items-center gap-2 font-bold">
              <span className="grid size-9 place-items-center rounded-full bg-white/12 ring-1 ring-white/20">
                <Mountain className="size-4" aria-hidden="true" />
              </span>
              ArunachalRise
            </Link>
            <div className="lg:hidden">
              <LogoutButton />
            </div>
          </div>
          <nav className="mt-6 flex gap-2 overflow-x-auto pb-2 lg:grid lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-w-fit items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-white/72 transition hover:bg-white/10 hover:text-white",
                    isActive &&
                      "bg-white text-forest-deep hover:bg-white hover:text-forest-deep",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 hidden lg:block">
            <LogoutButton />
          </div>
        </aside>
        <section className="min-w-0 p-4 sm:p-6 lg:p-10">
          <header className="mb-6 rounded-3xl border border-line bg-surface p-6 shadow-soft">
            <p className="text-sm font-bold uppercase text-stone">Admin CRM</p>
            <h1 className="mt-2 font-display text-5xl font-semibold leading-tight">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-3 max-w-3xl text-sm leading-7 text-stone">
                {subtitle}
              </p>
            ) : null}
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
