// src/proxy.ts
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static files, _next, assets etc
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".") // dot means maybe file extension
  ) {
    return NextResponse.next();
  }

  // Allow public page routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check session
  const session = await auth.api.getSession({ headers: request.headers });

  // Not logged in → redirect to home
  if (!session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run this proxy on all “page‑like” routes except APIs and static assets
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
