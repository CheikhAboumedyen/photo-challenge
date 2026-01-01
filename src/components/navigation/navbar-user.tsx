// src\components\navigation\navbar-user.tsx
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
import { authClient } from "@/lib/auth/auth-client";

type NavbarUserProps = {
  initialUser?: {
    role?: string | null;
  } | null;
};

const userLinksConfig = [
  { key: "userHome", href: "/home" },
  { key: "userSubmissions", href: "/submissions" },
  { key: "userLeaderboard", href: "/leaderboard" },
  { key: "userProfile", href: "/profile" },
];

const isActivePath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

export function NavbarUser({ initialUser }: NavbarUserProps) {
  const { data, isPending } = authClient.useSession();
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const userLinks = userLinksConfig.map((link) => ({
    ...link,
    name: t(link.key),
  }));

  const sessionUser = data?.user ?? initialUser ?? null;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          <LanguageSwitcher />
          <Button
            variant="secondary"
            className="rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
            onClick={handleSignOut}
          >
            {t("userSignOut")}
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
              <SheetTitle>{t("userMenu")}</SheetTitle>
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
              {userLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    router.push(link.href);
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

            <div className="mt-6 grid gap-3">
              <div className="flex items-center">
                <LanguageSwitcher variant="full" />
              </div>
              <Button
                variant="secondary"
                className="w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                onClick={() => {
                  setOpen(false);
                  handleSignOut();
                }}
              >
                {t("userSignOut")}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
