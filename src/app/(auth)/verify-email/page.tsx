// src\app\(auth)\verify-email\page.tsx

"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  const handleSendCode = async () => {
    if (!email) return;

    setIsSending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    if (error) {
      toast.error(error.message || "Failed to send verification code.");
    } else {
      toast.success("Verification code sent to your email.");
      setHasSent(true);
    }

    setIsSending(false);
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifying(true);

    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });

    if (error) {
      toast.error(error.message || "Verification failed.");
      setIsVerifying(false);
      return;
    }

    toast.success("Email verified successfully.");
    router.push("/home");
    setIsVerifying(false);
  };

  return (
    <div className="relative isolate min-h-screen bg-page px-4 py-12 text-brand-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-brand-gradient blur-[180px]" />
        <div className="absolute bottom-0 right-[-10%] h-64 w-64 rounded-full bg-brand-gradient blur-[160px]" />
      </div>

      <div className="relative mx-auto flex max-w-lg justify-center">
        <Card className="w-full overflow-hidden border border-nav-border/50 bg-panel/90 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <CardHeader className="space-y-3 text-center">
            <CardTitle className="text-3xl font-semibold">
              Verify your email
            </CardTitle>
            <CardDescription className="text-sm text-muted">
              We&apos;ve sent a 6-digit code to your inbox. Enter it below to
              confirm your email and finish setting up your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form className="space-y-5" onSubmit={handleVerify}>
              <div className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1 space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-white/90"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@email.com"
                      className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
                    />
                    {!email && (
                      <p className="text-xs text-white/60">
                        Enter your email to request a verification code.
                      </p>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleSendCode}
                    disabled={isSending || !email}
                    variant="outline"
                    className="h-12 shrink-0 rounded-full border-nav-border/60 bg-panel px-4 text-sm font-semibold text-white transition hover:bg-panel/80 focus-visible:ring-2 focus-visible:ring-brand-primary/40"
                  >
                    {isSending
                      ? "Sending..."
                      : hasSent
                      ? "Resend code"
                      : "Send verification code"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="otp"
                  className="text-sm font-medium text-white/90"
                >
                  Verification code
                </label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="Enter the 6-digit code"
                  className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
                />
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary transition hover:opacity-90"
                disabled={isVerifying}
              >
                {isVerifying ? "Verifying..." : "Verify email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
