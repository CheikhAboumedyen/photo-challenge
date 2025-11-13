// src/proxy.ts
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // // Allow static, assets, _next etc
  // if (
  //   pathname.startsWith("/_next/") ||
  //   pathname.startsWith("/static/") ||
  //   pathname.startsWith("/favicon.ico") ||
  //   pathname.includes(".")
  // ) {
  //   return NextResponse.next();
  // }

  // Allow public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check user session
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = session.user.role;

  // Protect admin-exclusive area
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Restrict: /challenges/[id] should be accessed only by normal users
  if (pathname.startsWith("/challenges/") && role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
