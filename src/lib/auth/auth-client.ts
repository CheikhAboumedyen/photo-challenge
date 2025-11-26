// src\lib\auth\auth-client.ts
import { createAuthClient } from "better-auth/react";
import {
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import type { auth } from "./auth"; // adjust path if your auth.ts is elsewhere

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  // Do NOT pass BETTER_AUTH_SECRET to the client – secrets must stay on the server
  plugins: [inferAdditionalFields<typeof auth>(), emailOTPClient()],
});

// Optional: export handy types
export type Session = typeof authClient.$Infer.Session;
export type AuthUser = Session["user"];
