"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const marketingLinks = [
  { name: "About", href: "/about" },
  { name: "Features", href: "/features" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Contact", href: "/contact" },
];

export function NavbarPublic() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-nav-border/50 bg-nav-surface/80 text-brand-foreground backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-tight text-brand-foreground"
        >
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.4em] text-white/70">
            PX
          </div>
          <span className="bg-brand-accent bg-clip-text text-transparent">
            PixiVerse
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          {marketingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative font-medium text-current"
            >
              <span
                className={
                  isActive(link.href)
                    ? "text-white"
                    : "transition-colors hover:text-white"
                }
              >
                {link.name}
              </span>
              <span
                className={`absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-brand-accent transition-transform ${
                  isActive(link.href) ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button
            variant="secondary"
            className="rounded-full border border-white/30 bg-transparent text-white hover:bg-white/10"
            onClick={() => router.push("/login")}
          >
            Log in
          </Button>
          <Button
            className="rounded-full bg-white text-slate-950 hover:bg-slate-100"
            onClick={() => router.push("/signup")}
          >
            Join now
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
            className="grid gap-4 border-t border-nav-border/40 bg-nav-surface/95 px-4 pb-6 pt-4 text-white/90 backdrop-blur-xl md:hidden"
          >
            {marketingLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavigate(link.href)}
                className={`text-left text-base font-medium ${
                  isActive(link.href) ? "text-white" : "text-white/70"
                }`}
              >
                {link.name}
              </button>
            ))}

            <div className="mt-2 grid gap-3">
              <Button
                variant="secondary"
                className="w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                onClick={() => handleNavigate("/login")}
              >
                Log in
              </Button>
              <Button
                className="w-full rounded-full bg-white text-slate-950 hover:bg-slate-100"
                onClick={() => handleNavigate("/signup")}
              >
                Join now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
