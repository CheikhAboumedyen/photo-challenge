// src/components/navbar-user.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function NavbarUser() {
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthed = !!session?.user;
  if (!session) return null; // or a loading state
  const role = (session.user as typeof session.user & { role?: string })?.role;

  const links = !isAuthed
    ? [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Login", href: "/login" },
        { name: "Signup", href: "/signup" },
      ]
    : role === "admin"
    ? [
        { name: "Home", href: "/home" },
        { name: "Admin Panel", href: "/admin" },
        { name: "Leaderboard", href: "/leaderboard" },
        { name: "Profile", href: "/profile" },
      ]
    : [
        { name: "Home", href: "/home" },
        { name: "My Submission", href: "/challenges/my-submission" },
        { name: "Leaderboard", href: "/leaderboard" },
        { name: "Profile", href: "/profile" },
      ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-gray-800">
        {/* Left - Logo */}
        <Link href="/" className="font-semibold text-lg hover:opacity-80">
          Photo Challenges
        </Link>

        {/* Center - Nav links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-black ${
                pathname === link.href
                  ? "text-black font-semibold"
                  : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right - Auth actions */}
        <div className="flex items-center gap-3">
          {isAuthed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                authClient.signOut();
                router.push("/");
              }}
            >
              Sign out
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-gray-900 text-white hover:bg-black"
              onClick={() => router.push("/login")}
            >
              Get Started
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
