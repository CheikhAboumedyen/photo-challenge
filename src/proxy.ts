// src/proxy.ts
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

// Routes that do NOT require authentication
const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow completely public pages
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // Check user session
  const session = await auth.api.getSession({ headers: request.headers });

  // If no session, redirect to landing/root
  if (!session?.user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const role = session.user.role;
  const emailVerified = session.user.emailVerified;

  // If user is logged in but email is NOT verified:
  // - Allow only /verify-email (to complete verification)
  // - Optionally allow /logout if you have such a route
  if (!emailVerified) {
    const isVerifyEmailPage = pathname === "/verify-email";
    const isLogout = pathname === "/logout"; // adjust if your logout route is different

    if (!isVerifyEmailPage && !isLogout) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }

    // Allow /verify-email and /logout to proceed
    return NextResponse.next();
  }

  // At this point, user is authenticated AND emailVerified === true

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
