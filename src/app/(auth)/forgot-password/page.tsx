// src\app\(auth)\forgot-password\page.tsx

import { headers } from "next/headers";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { auth } from "@/lib/auth/auth";

export default async function ForgotPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const email = session?.user?.email ?? "";
  const lockEmail = Boolean(session?.user);

  return (
    <div className="relative isolate min-h-screen bg-page px-4 py-12 text-brand-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-brand-gradient blur-[180px]" />
        <div className="absolute bottom-0 right-[-10%] h-64 w-64 rounded-full bg-brand-gradient blur-[160px]" />
      </div>

      <div className="relative mx-auto flex max-w-lg justify-center">
        <ForgotPasswordForm initialEmail={email} lockEmail={lockEmail} />
      </div>
    </div>
  );
}
