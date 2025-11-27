// src/i18n/request.ts
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const supportedLocales = ["en", "fr"] as const;
type SupportedLocale = (typeof supportedLocales)[number];

const fallbackLocale: SupportedLocale = "en";

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("locale")?.value;
  const locale: SupportedLocale =
    supportedLocales.find((candidate) => candidate === cookieLocale) ??
    fallbackLocale;

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
