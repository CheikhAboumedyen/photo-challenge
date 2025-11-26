// src/components/auth/signup-screen.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Crown, Frame, ImageIcon } from "lucide-react";
import { SignupForm } from "@/components/forms/signup-form";

const perks = [
  { icon: ImageIcon, label: "One photo per challenge" },
  { icon: Frame, label: "Fast, reliable uploads" },
  { icon: Crown, label: "Community leaderboard" },
];

export function SignupScreen() {
  return (
    <div className="relative isolate min-h-screen bg-page text-brand-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute right-[-10%] top-10 h-80 w-80 rounded-full bg-brand-gradient blur-[200px]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:items-stretch lg:gap-20 lg:px-8">
        <motion.section
          className="flex-1 space-y-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <Badge
            variant="secondary"
            className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-white/80 backdrop-blur"
          >
            Creator onboarding
          </Badge>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              Join weekly photo challenges with PixiVerse.
            </h1>
            <p className="text-lg text-muted">
              Join other photographers and creators, submit one photo per
              challenge, and grow through friendly voting.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {perks.map((perk) => (
              <li
                key={perk.label}
                className="flex items-center gap-3 rounded-2xl border border-nav-border/40 bg-panel/70 px-4 py-3 text-sm text-white/85"
              >
                <perk.icon className="h-4 w-4 text-brand-accent" />
                {perk.label}
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            Already have an account? Log in <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>

        <motion.section
          className="w-full max-w-md flex-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <SignupForm />
        </motion.section>
      </div>
    </div>
  );
}
