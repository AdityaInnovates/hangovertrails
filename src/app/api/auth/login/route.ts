import bcrypt from "bcryptjs";
import { z } from "zod";
import { fail, ok } from "@/lib/api-response";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const getClientIp = (request: Request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "local";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(
    `login:${ip}`,
    env.LOGIN_RATE_LIMIT_MAX,
    env.LOGIN_RATE_LIMIT_WINDOW_MINUTES,
  );

  if (!limit.allowed) {
    return fail(
      "RATE_LIMITED",
      "Too many login attempts. Please wait before trying again.",
      429,
    );
  }

  const payload = loginSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return fail("INVALID_LOGIN_PAYLOAD", "Enter a valid email and password.");
  }

  const user = await prisma.user.findUnique({
    where: { email: payload.data.email.toLowerCase() },
  });
  const validPassword = user
    ? await bcrypt.compare(payload.data.password, user.passwordHash)
    : false;

  if (!user || !validPassword || user.role !== "ADMIN") {
    await prisma.auditLog.create({
      data: {
        actorEmail: payload.data.email.toLowerCase(),
        action: "LOGIN_FAILED",
        entityType: "User",
        ip,
        metadata: { reason: "invalid_credentials" },
      },
    });

    return fail(
      "INVALID_CREDENTIALS",
      "The email or password is incorrect.",
      401,
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), lastLoginIp: ip },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorEmail: user.email,
      action: "LOGIN_SUCCESS",
      entityType: "User",
      entityId: user.id,
      ip,
    },
  });

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    sessionVersion: user.sessionVersion,
  });

  const response = ok({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: env.SESSION_IDLE_MINUTES * 60,
    path: "/",
  });

  return response;
}
