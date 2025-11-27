// src/app/(auth)/login/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth/auth";
import { LoginScreen } from "@/components/auth/login-screen";

export default async function LoginPage() {
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
        <h1>{t("loginTitle")}</h1>
        <p>{t("loginSubtitle")}</p>
      </div>
      <LoginScreen />
    </>
  );
}
