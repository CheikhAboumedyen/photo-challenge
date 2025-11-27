// src\components\forms\forgot-password-form.tsx
"use client";

import { FormEvent, useState } from "react";
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
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth/auth-client";

type ForgotPasswordFormProps = {
  initialEmail?: string;
  lockEmail?: boolean;
};

export function ForgotPasswordForm({
  initialEmail,
  lockEmail,
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSendCode = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your email.");
      return;
    }

    setIsSending(true);
    const { error } = await authClient.forgetPassword.emailOtp({
      email: normalizedEmail,
    });

    if (error) {
      toast.error(error.message || "Failed to send reset code.");
    } else {
      toast.success("Reset code sent to your email.");
      setStep(2);
    }

    setIsSending(false);
  };

  const handleReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!otp) {
      toast.error("Please enter the code we sent to your email.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsResetting(true);

    const normalizedEmail = email.trim().toLowerCase();

    const { error } = await authClient.emailOtp.resetPassword({
      email: normalizedEmail,
      otp,
      password,
    });

    if (error) {
      toast.error(error.message || "Failed to reset password.");
      setIsResetting(false);
      return;
    }

    toast.success("Password reset successfully. You can now log in.");
    router.push("/login");
    setIsResetting(false);
  };

  return (
    <Card className="w-full overflow-hidden border border-nav-border/50 bg-panel/90 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
      <CardHeader className="space-y-3 text-center">
        <CardTitle className="text-3xl font-semibold">Reset your password</CardTitle>
        <CardDescription className="text-sm text-muted">
          {step === 1
            ? "Enter your email to receive a reset code."
            : `We\u2019ve sent a 6-digit code to ${email}. Enter it below with your new password.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white/90">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
                readOnly={lockEmail}
                disabled={lockEmail}
              />
              {lockEmail ? (
                <p className="text-xs text-white/60">
                  You are resetting the password for this signed-in account.
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              onClick={handleSendCode}
              disabled={isSending}
              className="h-12 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary transition hover:opacity-90"
            >
              {isSending ? "Sending..." : "Send reset code"}
            </Button>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleReset}>
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium text-white/90">
                Reset code
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

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white/90">
                New password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/90">
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary transition hover:opacity-90"
              disabled={isResetting}
            >
              {isResetting ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
