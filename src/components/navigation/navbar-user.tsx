"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";

type NavbarUserProps = {
  initialUser?: {
    role?: string | null;
  } | null;
};

const userLinks = [
  { name: "Home", href: "/home" },
  { name: "Submissions", href: " /submissions" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Profile", href: "/profile" },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export function NavbarUser({ initialUser }: NavbarUserProps) {
  const { data, isPending } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const sessionUser = data?.user ?? initialUser ?? null;

  if (!sessionUser && isPending) {
    return (
      <header className="sticky top-0 z-50 border-b border-nav-border/40 bg-nav-surface/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
        </div>
      </header>
    );
  }

  if (!sessionUser || sessionUser.role === "admin") {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-nav-border/50 bg-nav-surface/80 text-brand-foreground backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/home"
          className="flex items-center gap-3 font-semibold tracking-tight text-brand-foreground"
        >
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
            PX
          </div>
          <span className="bg-brand-accent bg-clip-text text-transparent">
            PixiVerse
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          {userLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative font-medium transition-colors ${
                isActivePath(pathname, link.href)
                  ? "text-white"
                  : "hover:text-white"
              }`}
            >
              {link.name}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-brand-accent transition-transform ${
                  isActivePath(pathname, link.href)
                    ? "scale-x-100"
                    : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="secondary"
            className="rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/20 p-2 text-white md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-nav-border/40 bg-nav-surface/95 px-4 pb-6 pt-4 text-white/90 backdrop-blur-xl"
          >
            <div className="grid gap-4">
              {userLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    router.push(link.href);
                    setOpen(false);
                  }}
                  className={`text-left text-base font-medium ${
                    isActivePath(pathname, link.href)
                      ? "text-white"
                      : "text-white/70"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              className="mt-6 w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
              onClick={() => {
                setOpen(false);
                handleSignOut();
              }}
            >
              Sign out
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
