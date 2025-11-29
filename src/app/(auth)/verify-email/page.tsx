// src/app/(auth)/verify-email/page.tsx

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { VerifyEmailForm } from "@/components/forms/verify-email-form";
import { auth } from "@/lib/auth/auth";

export default async function VerifyEmailPage() {
  const t = await getTranslations("Auth");
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.emailVerified) {
    redirect("/home");
  }

  const email = session.user.email;

  return (
    <div className="relative isolate min-h-screen bg-page px-4 py-12 text-brand-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-brand-gradient blur-[180px]" />
        <div className="absolute bottom-0 right-[-10%] h-64 w-64 rounded-full bg-brand-gradient blur-[160px]" />
      </div>

      <div className="relative mx-auto flex max-w-lg justify-center">
        <div className="sr-only">
          <h1>{t("verifyEmailPageTitle")}</h1>
          <p>{t("verifyEmailPageSubtitle")}</p>
        </div>
        <VerifyEmailForm email={email} />
      </div>
    </div>
  );
}