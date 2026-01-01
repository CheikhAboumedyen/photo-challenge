// src\app\(user)\home\page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth/auth";
import { formatDistanceToNowStrict, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Sparkles, Upload, Users, Trophy } from "lucide-react";
import MySubmission from "@/components/my-submission/my-submission";
import {
  getActiveChallenge,
  getLeaderboardPreviewForChallenge,
} from "@/app/(user)/leaderboard/actions";
import { getSiteStats } from "@/lib/stats";

export default async function HomeDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role === "admin") {
    redirect("/admin");
  }

  const t = await getTranslations("Home");
  const locale = await getLocale();

  const active = await getActiveChallenge();
  const siteStats = await getSiteStats();
  const leaderboardPreview = active
    ? await getLeaderboardPreviewForChallenge(active.id)
    : [];
  const numberFormatter = new Intl.NumberFormat(locale);
  const weeklyRhythm = [
    {
      label: t("weeklyRhythm.upload.label"),
      range: t("weeklyRhythm.upload.range"),
      description: t("weeklyRhythm.upload.description"),
      icon: Upload,
    },
    {
      label: t("weeklyRhythm.vote.label"),
      range: t("weeklyRhythm.vote.range"),
      description: t("weeklyRhythm.vote.description"),
      icon: Users,
    },
    {
      label: t("weeklyRhythm.celebrate.label"),
      range: t("weeklyRhythm.celebrate.range"),
      description: t("weeklyRhythm.celebrate.description"),
      icon: Trophy,
    },
  ];
  const communityStats = [
    {
      label: t("communityStats.photosSubmitted"),
      value: numberFormatter.format(siteStats.totalPhotos),
    },
    {
      label: t("communityStats.activeMembers"),
      value: numberFormatter.format(siteStats.totalMembers),
    },
    {
      label: t("communityStats.votesCast"),
      value: numberFormatter.format(siteStats.totalVotes),
    },
  ];
  const countdown = active
    ? formatDistanceToNowStrict(new Date(active.endDate), { addSuffix: true })
    : null;

  return (
    <div className="relative isolate min-h-screen bg-page px-4 py-16 text-brand-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-brand-gradient blur-[180px]" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-gradient blur-[200px]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="relative overflow-hidden rounded-4xl border border-nav-border/50 bg-panel/90 p-8 shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
                >
                  {t("activeChallengeBadge")}
                </Badge>
                {countdown && (
                  <span className="text-sm text-white/70">
                    {t("endsLabel", { countdown })}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold sm:text-4xl">
                  {active ? active.title : t("noActiveChallengeTitle")}
                </h1>
                {active?.description ? (
                  <p className="text-base text-muted">{active.description}</p>
                ) : (
                  <p className="text-base text-muted">
                    {t("noActiveChallengeDescription")}
                  </p>
                )}
              </div>

              {active && (
                <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm sm:grid-cols-3">
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-white/60">
                      <CalendarRange className="h-4 w-4" /> {t("startLabel")}
                    </p>
                    <p className="font-medium text-white">
                      {format(new Date(active.startDate), "PPP p")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-white/60">
                      <CalendarRange className="h-4 w-4" /> {t("endLabel")}
                    </p>
                    <p className="font-medium text-white">
                      {format(new Date(active.endDate), "PPP p")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="flex items-center gap-2 text-white/60">
                      <Sparkles className="h-4 w-4" /> {t("statusLabel")}
                    </p>
                    <p className="font-medium text-white">
                      {countdown
                        ? t("closingLabel", { countdown })
                        : t("tbaLabel")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-4xl border border-nav-border/50 bg-panel/80 p-8 text-white shadow-[0_20px_45px_rgba(2,6,23,0.65)]">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                  {t("actionsEyebrow")}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {active ? t("actionsTitleActive") : t("actionsTitleInactive")}
                </h2>
                <p className="text-sm text-white/70">
                  {t("actionsDescription")}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {active ? (
                  <>
                    <Button
                      asChild
                      className="h-12 w-full rounded-full bg-brand-gradient text-brand-on-primary text-base font-semibold hover:opacity-90"
                    >
                      <Link href={`/challenges/${active.id}`}>
                        {t("viewVoteCta")}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="h-12 w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      <Link href={`/challenges/${active.id}/upload`}>
                        {t("uploadPhotoCta")}
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      asChild
                      className="h-12 w-full rounded-full bg-brand-gradient text-brand-on-primary text-base font-semibold hover:opacity-90"
                    >
                      <Link href="/submissions">{t("browseArchiveCta")}</Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="h-12 w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      <Link href="/leaderboard">{t("seeLeaderboardCta")}</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {active && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <MySubmission challengeId={active.id} />
            <div className="rounded-4xl border border-nav-border/40 bg-panel/80 p-6 shadow-[0_20px_45px_rgba(2,6,23,0.65)]">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                {t("weeklyFlowTitle")}
              </p>
              <div className="mt-4 space-y-4">
                {weeklyRhythm.map((step) => (
                  <div
                    key={step.label}
                    className="rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span className="flex items-center gap-2 font-medium text-white">
                        <step.icon className="h-4 w-4 text-brand-accent" />
                        {step.label}
                      </span>
                      <span>{step.range}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/70">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[28px] border border-nav-border/40 bg-panel/80 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                {t("leaderboardPreviewTitle")}
              </p>
              <Link
                href="/leaderboard"
                className="text-sm text-white/70 transition hover:text-white"
              >
                {t("leaderboardViewAll")}
              </Link>
            </div>
            {leaderboardPreview.length === 0 ? (
              <p className="mt-5 text-sm text-white/70">
                {t("leaderboardEmpty")}
              </p>
            ) : (
              <ul className="mt-5 space-y-4">
                {leaderboardPreview.map((entry, index) => (
                  <li
                    key={entry.photoId ?? `${entry.userId}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3 text-white"
                  >
                    <span className="flex items-center gap-2 text-sm">
                      <span className="text-white/60">{index + 1}.</span>
                      {entry.userName || t("anonymousUser")}
                    </span>
                    <span className="text-sm text-white/70">
                      {t("votesLabel", { count: entry.voteCount })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[28px] border border-nav-border/40 bg-panel/80 p-6">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              {t("communityPulseTitle")}
            </p>
            <div className="mt-6 grid gap-4">
              {communityStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/5 bg-black/10 px-4 py-3"
                >
                  <p className="text-3xl font-semibold">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-nav-border/40 bg-panel/80 p-6">
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              {t("refresherTitle")}
            </p>
            <p className="mt-4 text-white/85">{t("refresherDescription")}</p>
            <Button
              asChild
              variant="secondary"
              className="mt-6 h-12 w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/submissions">{t("openArchiveCta")}</Link>
            </Button>
          </div>
        </section>

        <div className="rounded-[28px] border border-nav-border/30 bg-panel/70 p-6 text-sm text-white/70">
          {t("tipText")}
        </div>
      </div>
    </div>
  );
}
