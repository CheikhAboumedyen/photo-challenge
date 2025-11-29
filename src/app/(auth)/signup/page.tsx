// src/app/(auth)/signup/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth/auth";
import { SignupScreen } from "@/components/auth/signup-screen";

export default async function SignupPage() {
  const t = await getTranslations("Auth");
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user) {
    if (session.user.role === "admin") {
      redirect("/admin");
    } else {
      redirect("/home");
    }
  }

  return (
    <>
      <div className="sr-only">
        <h1>{t("signUpPageTitle")}</h1>
        <p>{t("signUpPageSubtitle")}</p>
      </div>
      <SignupScreen />
    </>
  );
}