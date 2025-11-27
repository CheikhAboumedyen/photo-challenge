"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const locales = ["en", "fr"] as const;
type Locale = (typeof locales)[number];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();

  const handleChange = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="inline-flex items-center rounded-full border bg-background px-1 py-0.5 text-xs">
      {locales.map((item) => {
        const isActive = item === locale;
        return (
          <button
            key={item}
            type="button"
            onClick={() => handleChange(item)}
            className={cn(
              "px-2 py-0.5 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {item.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}