// src\components\navigation\language-switcher.tsx
"use client";

import { Check, Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const locales = ["en", "fr"] as const;
type Locale = (typeof locales)[number];

const LANGUAGE_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
};

type LanguageSwitcherProps = {
  variant?: "compact" | "full";
};

export function LanguageSwitcher({
  variant = "compact",
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const handleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  const currentLabel = LANGUAGE_LABELS[locale] ?? locale.toUpperCase();
  const isFull = variant === "full";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size={isFull ? "default" : "sm"}
          className={cn(
            "flex items-center gap-2 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10 px-3",
            isFull ? "w-full justify-center" : "justify-center"
          )}
        >
          <Languages className="h-4 w-4" />
          <span className="uppercase">{currentLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[140px] border border-white/15 bg-nav-surface/95 text-xs text-white/80"
      >
        {locales.map((item) => {
          const isActive = item === locale;
          return (
            <DropdownMenuItem
              key={item}
              onClick={() => handleChange(item)}
              className="flex items-center gap-2 px-3 py-2 text-sm uppercase bg-transparent cursor-pointer data-highlighted:bg-white/10 data-highlighted:text-white"
            >
              <span>{LANGUAGE_LABELS[item]}</span>
              {isActive && <Check className="ml-auto h-3 w-3" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
