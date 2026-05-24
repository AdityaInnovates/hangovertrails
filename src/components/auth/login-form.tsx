"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginResponse =
  | { success: true; data: { user: { email: string } } }
  | { success: false; error: { code: string; message: string } };

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath = "/admin" }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("admin@arunachaltourism.local");
  const [password, setPassword] = useState("admin1234");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = (await response.json()) as LoginResponse;

    setLoading(false);

    if (!result.success) {
      setError(result.error.message);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
      <Input
        label="Admin email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoComplete="email"
        required
      />
      <div className="relative">
        <Input
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          className="absolute right-3 top-9 grid size-8 place-items-center rounded-full text-stone transition hover:bg-foreground/5"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((current) => !current)}
        >
          {showPassword ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p className="rounded-2xl bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {error}
        </p>
      )}
      <Button
        type="submit"
        size="lg"
        disabled={!email || !password || loading}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        {loading ? "Signing in" : "Enter CRM"}
      </Button>
    </form>
  );
}
