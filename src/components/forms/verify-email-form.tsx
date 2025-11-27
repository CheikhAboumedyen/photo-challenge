// src\components\forms\verify-email-form.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth/auth-client";

type VerifyEmailFormProps = {
  email: string;
};

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const router = useRouter();
  const normalizedEmail = email.trim().toLowerCase();
  const [otp, setOtp] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  const handleSendCode = async () => {
    if (isSending || cooldownSeconds > 0) return;

    setIsSending(true);
    // Sends a new OTP every time (including auto-send on mount); previous codes become stale once a new one is issued.
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: normalizedEmail,
      type: "email-verification",
    });

    if (error) {
      toast.error(error.message || "Failed to send verification code.");
    } else {
      toast.success("Verification code sent to your email.");
      setHasSent(true);
      setCooldownSeconds(60);
    }

    setIsSending(false);
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifying(true);
    const { error } = await authClient.emailOtp.verifyEmail({
      email: normalizedEmail,
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

  useEffect(() => {
    if (cooldownSeconds === 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = `pv-email-verification-sent:${normalizedEmail}`;
    if (sessionStorage.getItem(key)) {
      return;
    }

    sessionStorage.setItem(key, "1");
    void handleSendCode();
  }, [normalizedEmail]);

  return (
    <Card className="w-full overflow-hidden border border-nav-border/50 bg-panel/90 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-3xl font-semibold">
          Verify your email
        </CardTitle>
        <CardDescription className="text-sm text-muted">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="font-medium text-white">{email}</span>. Enter it
          below to confirm your email and finish setting up your account.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form className="space-y-5" onSubmit={handleVerify}>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={isSending || cooldownSeconds > 0}
              variant="outline"
              className="h-12 rounded-full border-nav-border/60 bg-panel px-6 text-sm font-semibold text-white transition hover:bg-panel/80 focus-visible:ring-2 focus-visible:ring-brand-primary/40 cursor-pointer"
            >
              {isSending
                ? "Sending..."
                : cooldownSeconds > 0
                ? `Resend in ${cooldownSeconds}s`
                : hasSent
                ? "Resend code"
                : "Send code"}
            </Button>
          </div>

          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium text-white/90">
              Verification code
            </label>
            <div className="flex justify-center">
              <InputOTP
                id="otp"
                maxLength={6}
                value={otp}
                onChange={setOtp}
                className="text-lg"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary transition hover:opacity-90"
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// OTP flow notes:
// - On mount, handleSendCode auto-runs and issues a fresh OTP; clicking "Send/Resend" generates another code. Only the latest code is valid, so pasting an earlier one can fail.
// - Because email comes from props, if a user reached here with a different email than the one that received the OTP (e.g., stale query or different session), verification will fail with "Invalid OTP". Normalizing email for send/verify reduces mismatch risk.
// - Rapid resend + verify attempts can overlap: a user might copy an OTP from the console that was issued before the most recent resend, leading to intermittent failures.
