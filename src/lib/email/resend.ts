// src/lib/email/resend.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

type OtpType = "sign-in" | "email-verification" | "forget-password";

export async function sendOtpEmail({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: OtpType;
}) {
  const from = process.env.EMAIL_FROM || "PixiVerse <no-reply@example.com>";

  const subjectMap: Record<OtpType, string> = {
    "sign-in": "Your PixiVerse sign-in code",
    "email-verification": "Verify your PixiVerse email",
    "forget-password": "Reset your PixiVerse password",
  };

  const subject = subjectMap[type] ?? "Your PixiVerse security code";

  await resend.emails.send({
    from,
    to: email,
    subject,
    text: `Your code is: ${otp}\n\nType: ${type}\nThis code will expire soon.`,
    // I should enhance this later
  });
}
