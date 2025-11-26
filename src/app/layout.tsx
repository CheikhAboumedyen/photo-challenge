// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppNavbarClient } from "@/components/navigation/app-navbar";
import { AppFooter } from "@/components/navigation/app-footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixiVerse",
  description:
    "Weekly portrait challenges built on Next.js, Drizzle, and BetterAuth.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden bg-page text-brand-foreground`}
      >
        <ReactQueryProvider>
          <AppNavbarClient />
          {children}
          <AppFooter />
        </ReactQueryProvider>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
