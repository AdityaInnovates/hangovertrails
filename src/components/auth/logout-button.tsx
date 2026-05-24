"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      className="rounded-full bg-foreground px-5 py-3 text-sm font-bold text-white"
      type="button"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
