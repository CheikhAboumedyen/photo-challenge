// src/app/page.tsx
import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Camera,
  CalendarRange,
  Crown,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteStats } from "@/lib/stats";

export default async function Home() {
  const t = await getTranslations("Landing");
  const locale = await getLocale();
  const stats = await getSiteStats();
  const numberFormatter = new Intl.NumberFormat(locale);

  const statItems = [
    { value: numberFormatter.format(stats.totalMembers), label: t("statActiveMembers") },
    { value: numberFormatter.format(stats.totalPhotos), label: t("statPhotosUploaded") },
    { value: numberFormatter.format(stats.totalVotes), label: t("statVotesCast") },
  ];

  const highlights = [
    { title: t("highlightWeeklyTitle"), description: t("highlightWeeklyDesc"), icon: Sparkles },
    { title: t("highlightSimpleTitle"), description: t("highlightSimpleDesc"), icon: Camera },
    { title: t("highlightVotingTitle"), description: t("highlightVotingDesc"), icon: Users },
  ];

  const timeline = [
    { title: t("timelineSubmitTitle"), range: t("timelineSubmitRange"), copy: t("timelineSubmitCopy") },
    { title: t("timelineVoteTitle"), range: t("timelineVoteRange"), copy: t("timelineVoteCopy") },
    { title: t("timelineCelebrateTitle"), range: t("timelineCelebrateRange"), copy: t("timelineCelebrateCopy") },
  ];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-y-0 left-1/2 h-full w-160 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[140px]" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6 lg:gap-20 lg:px-8 lg:pt-24">
        <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <div className="space-y-8">
            <Badge
              variant="secondary"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/90 backdrop-blur"
            >
              {t("heroBadge")}
            </Badge>

            <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </h1>

            <p className="text-lg text-slate-300">{t("heroSubtitle")}</p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full bg-indigo-500 px-7 text-base font-medium hover:bg-indigo-600"
                asChild
              >
                <Link href="/signup">
                  {t("ctaPrimary")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/login">{t("ctaSecondary")}</Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {statItems.map((item) => (
                <div key={item.label}>
                  <p className="text-3xl font-semibold text-white">{item.value}</p>
                  <p className="text-sm uppercase tracking-wide text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative isolate overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-300">
                  {t("currentChallengeLabel")}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  {t("currentChallengeTitle")}
                </h2>
                <p className="text-sm text-slate-300">{t("currentChallengeSubtitle")}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>{t("currentChallengeHighlight")}</span>
                  <span>{t("currentChallengeTopPhotos")}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-200">
                  <span>{t("currentChallengeCreatedBy")}</span>
                  <span>{t("currentChallengeCreatedByValue")}</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center gap-3 text-slate-200">
                  <CalendarRange className="h-5 w-5 text-indigo-300" />
                  {t("currentChallengeVoting")}
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <ShieldCheck className="h-5 w-5 text-indigo-300" />
                  {t("currentChallengeBlindReview")}
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <Crown className="h-5 w-5 text-indigo-300" />
                  {t("currentChallengeResults")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="highlights" className="space-y-6">
          <div>
            <h2 id="highlights" className="text-2xl font-semibold text-white">
              {t("highlightsTitle")}
            </h2>
            <p className="text-slate-400">{t("highlightsSubtitle")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((highlight) => (
              <Card key={highlight.title} className="border-white/10 bg-white/5 text-white">
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <highlight.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{highlight.title}</h3>
                    <p className="text-sm text-slate-300">{highlight.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="timeline" className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 id="timeline" className="text-2xl font-semibold text-white">
              {t("timelineTitle")}
            </h2>
            <p className="text-slate-400">{t("timelineSubtitle")}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {timeline.map((step) => (
                <div key={step.title} className="space-y-2">
                  <p className="text-sm font-medium text-indigo-200">{step.range}</p>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                  <p className="text-sm text-slate-300">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 p-10 text-center shadow-2xl">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <h3 className="text-3xl font-semibold text-white">{t("finalCtaTitle")}</h3>
            <p className="text-white/90">{t("finalCtaSubtitle")}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full bg-white text-indigo-600 hover:text-white hover:bg-white/20"
                asChild
              >
                <Link href="/signup">{t("finalCtaPrimary")}</Link>
              </Button>
              <Button
                size="lg"
                className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/20"
                asChild
              >
                <Link href="/login">{t("finalCtaSecondary")}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}