// src\components\navigation\language-switcher.tsx
"use client";

import { Check, Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useRef, useEffect, useState } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const updateWidth = () => {
      if (triggerRef.current) {
        setTriggerWidth(triggerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

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
          ref={triggerRef}
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
        align={isFull ? "start" : "end"}
        style={triggerWidth ? { width: `${triggerWidth}px` } : undefined}
        className={cn(
          "border border-white/15 bg-nav-surface/95 backdrop-blur-sm shadow-lg rounded-lg",
          isFull ? "w-full min-w-0" : "min-w-[140px]"
        )}
      >
        {locales.map((item) => {
          const isActive = item === locale;
          return (
            <DropdownMenuItem
              key={item}
              onClick={() => handleChange(item)}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2.5 text-sm uppercase rounded-md transition-colors",
                "bg-transparent cursor-pointer",
                "hover:bg-white/10 hover:text-white",
                "focus:bg-white/10 focus:text-white",
                "data-highlighted:bg-white/10 data-highlighted:text-white",
                isActive && "text-white font-medium"
              )}
            >
              <span className="flex items-center gap-2">
                <Languages className="h-3.5 w-3.5 opacity-70" />
                <span>{LANGUAGE_LABELS[item]}</span>
              </span>
              {isActive && <Check className="h-4 w-4 text-white" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
