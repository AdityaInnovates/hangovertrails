import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentAdmin } from "@/lib/auth";
import { env } from "@/lib/env";

export const metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const admin = await getCurrentAdmin();

  if (!admin) redirect("/login?next=/admin/settings");

  return (
    <AdminShell
      active="/admin/settings"
      title="Local Settings"
      subtitle="Environment and security posture for the PostgreSQL V1 build."
    >
      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-stone">Signed in as</p>
          <p className="mt-2 text-xl font-black">{admin.email}</p>
        </article>
        <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-stone">Upload directory</p>
          <p className="mt-2 break-all text-sm font-bold">{env.UPLOAD_DIR}</p>
        </article>
        <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-stone">Login rate limit</p>
          <p className="mt-2 text-xl font-black">
            {env.LOGIN_RATE_LIMIT_MAX} attempts /{" "}
            {env.LOGIN_RATE_LIMIT_WINDOW_MINUTES} min
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
          <p className="text-sm font-bold text-stone">Session idle lifetime</p>
          <p className="mt-2 text-xl font-black">
            {env.SESSION_IDLE_MINUTES} minutes
          </p>
        </article>
      </section>
    </AdminShell>
  );
}
