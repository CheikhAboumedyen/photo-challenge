// src\components\navigation\navbar-public.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutGrid, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/navigation/language-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function NavbarPublic() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const marketingLinks = [
    { name: t("publicAbout"), href: "/" },
    { name: t("publicLeaderboard"), href: "/leaderboard" },
    { name: t("publicContact"), href: "/#" },
  ];

  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          <LanguageSwitcher />
          <Button
            variant="secondary"
            size="sm"
            className="rounded-full border border-white/30 bg-transparent text-white hover:bg-white/10"
            onClick={() => router.push("/login")}
          >
            {t("publicLogin")}
          </Button>
          <Button
            className="rounded-full bg-white text-slate-950 hover:bg-slate-100"
            size="sm"
            onClick={() => router.push("/signup")}
          >
            {t("publicJoin")}
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full border border-white/20 bg-white/5 text-white transition-transform hover:bg-white/10 active:scale-[0.98]"
              aria-label="Toggle menu"
            >
              <LayoutGrid size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="top"
            className="md:hidden max-h-[100dvh] overflow-y-auto border-b border-nav-border/40 bg-nav-surface/95 px-4 pb-6 pt-16 text-white/90 backdrop-blur-xl [&_[data-slot=sheet-close-default]]:hidden"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>{t("publicAbout")}</SheetTitle>
            </SheetHeader>
            <div className="flex items-center justify-end">
              <SheetClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-white/20 text-white hover:bg-white/10"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </Button>
              </SheetClose>
            </div>

            <div className="mt-4 grid gap-4">
              {marketingLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavigate(link.href)}
                  className={`text-left text-base font-medium ${
                    isActive(link.href) ? "text-white" : "text-white/70"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <div className="flex items-center">
                <LanguageSwitcher variant="full" />
              </div>
              <Button
                variant="secondary"
                className="w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                onClick={() => handleNavigate("/login")}
              >
                {t("publicLogin")}
              </Button>
              <Button
                className="w-full rounded-full bg-white text-slate-950 hover:bg-slate-100"
                onClick={() => handleNavigate("/signup")}
              >
                {t("publicJoin")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
