import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE_NAME } from "@/lib/auth-constants";

const protectedPrefixes = ["/admin", "/api/admin"];

export async function proxy(request: NextRequest) {
  const isProtected = protectedPrefixes.some((prefix) => request.nextUrl.pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const secret = process.env.JWT_SECRET ? new TextEncoder().encode(process.env.JWT_SECRET) : null;

  if (token && secret) {
    const session = await jwtVerify(token, secret).catch(() => null);

    if (session?.payload.role === "ADMIN") {
      return NextResponse.next();
    }
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Admin authentication is required." } }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};