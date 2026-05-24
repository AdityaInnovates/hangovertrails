import { ok } from "@/lib/api-response";
import { SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = ok({ loggedOut: true });

  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });

  return response;
}
