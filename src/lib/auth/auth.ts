// src\lib\auth\auth.ts

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance
import { emailOTP } from "better-auth/plugins/email-otp";
import { sendOtpEmail } from "../email/resend";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: false, // This will assume the database will generate the ID automatically
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user", // default role for new users
        input: false, // users cannot set this themselves
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600, // 10 minutes
      allowedAttempts: 5,
      async sendVerificationOTP({ email, otp, type }) {
        const ownerEmail = process.env.OTP_OWNER_EMAIL;

        // If this is your verified email → send via Resend
        if (ownerEmail && email === ownerEmail) {
          try {
            await sendOtpEmail({ email, otp, type });
          } catch (err) {
            console.error("Failed to send OTP email via Resend:", err);
          }
        } else {
          // For all other emails, just log the OTP on the server
          console.log(`[DEBUG OTP] type=${type} email=${email} otp=${otp}`);
        }
      },
    }),
  ],
});
