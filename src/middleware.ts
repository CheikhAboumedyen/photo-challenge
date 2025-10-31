// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Paths that only admins can access
const adminPaths = ["/admin", "/admin/:path*"];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow public access to "/"
  if (path === "/") return NextResponse.next();

  // Get user session using Better Auth's built-in method
  const session = await auth.api.getSession({
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
  });

  // Redirect unauthorized users to /login
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect non-admins trying to access admin routes
  const isAdminPath = adminPaths.some((p) => {
    if (p.endsWith("*")) {
      return path.startsWith(p.replace("*", ""));
    }
    return path === p;
  });

  if (isAdminPath && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
