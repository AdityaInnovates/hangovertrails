import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

export { SESSION_COOKIE_NAME };

const secret = new TextEncoder().encode(env.JWT_SECRET);

type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  sessionVersion: number;
};

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({
    email: payload.email,
    role: payload.role,
    sessionVersion: payload.sessionVersion,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${env.SESSION_IDLE_MINUTES}m`)
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);

  if (!payload.sub || payload.role !== "ADMIN") {
    return null;
  }

  return {
    userId: payload.sub,
    email: String(payload.email),
    role: String(payload.role),
    sessionVersion: Number(payload.sessionVersion),
  };
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token).catch(() => null);

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  if (!user || user.role !== "ADMIN" || user.sessionVersion !== session.sessionVersion) {
    return null;
  }

  return user;
}