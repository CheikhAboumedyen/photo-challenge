// src/components/navbar-admin.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function NavbarAdmin() {
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Challenges", href: "/admin/challenges" },
    { name: "Photos", href: "/admin/photos" },
    { name: "Leaderboard", href: "/admin/leaderboard" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-gray-800">
        {/* Left - Logo */}
        <Link href="/admin" className="font-semibold text-lg hover:opacity-80">
          Admin Panel
        </Link>

        {/* Center - Nav Links */}
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

        {/* Right - Logout */}
        <div className="flex items-center gap-3">
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
        </div>
      </nav>
    </header>
  );
}
