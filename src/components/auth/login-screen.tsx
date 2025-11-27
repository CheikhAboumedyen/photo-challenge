// src/components/auth/login-screen.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { LoginForm } from "@/components/forms/login-form";

export function LoginScreen() {
  const t = useTranslations("Auth");

  const highlights = [
    {
      icon: Sparkles,
      label: t("loginHighlightNewChallenges"),
    },
    {
      icon: ShieldCheck,
      label: t("loginHighlightBlindVoting"),
    },
    {
      icon: Users,
      label: t("loginHighlightCreatorsTogether"),
    },
  ];

  return (
    <div className="relative isolate min-h-screen bg-page text-brand-foreground">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-brand-gradient blur-[180px]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-16 lg:flex-row lg:items-stretch lg:gap-20 lg:px-8">
        <motion.section
          className="flex-1 space-y-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <Badge
            variant="secondary"
            className="w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-white/80 backdrop-blur"
          >
            {t("loginScreenBadge")}
          </Badge>
          <div className="space-y-4">
            <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl">
              {t("loginScreenTitle")}
            </h1>
            <p className="text-lg text-muted">{t("loginScreenSubtitle")}</p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {highlights.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-nav-border/40 bg-panel/70 px-4 py-3 text-sm text-white/85"
              >
                <item.icon className="h-4 w-4 text-brand-accent" />
                {item.label}
              </li>
            ))}
          </ul>

          <Link
            href="/signup"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white"
          >
            {t("loginNoAccountYet")}&nbsp;
            {t("createAccountLink")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.section>

        <motion.section
          className="w-full max-w-md flex-1"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          <LoginForm />
        </motion.section>
      </div>
    </div>
  );
}