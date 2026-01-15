// src\app\(admin)\admin\page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNowStrict } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  CalendarRange,
  Sparkles,
  Trophy,
  Users,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import {
  getActiveChallenge,
  getLeaderboardPreviewForChallenge,
} from "@/app/(user)/leaderboard/actions";
import { getSiteStats } from "@/lib/stats";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/home");
  }

  const t = await getTranslations("AdminDashboard");
  const tHome = await getTranslations("Home");
  const tPhotos = await getTranslations("AdminPhotos");
  const locale = await getLocale();
  const dateLocale = locale === "fr" ? fr : enUS;
  const activeChallenge = await getActiveChallenge();
  const siteStats = await getSiteStats();
  const leaderboardPreview = activeChallenge
    ? await getLeaderboardPreviewForChallenge(activeChallenge.id)
    : [];
  const numberFormatter = new Intl.NumberFormat(locale);
  const countdown = activeChallenge
    ? formatDistanceToNowStrict(new Date(activeChallenge.endDate), {
        addSuffix: true,
      })
    : null;

  return (
    <div className="relative isolate min-h-screen bg-page px-4 py-16 text-brand-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-0 top-24 h-72 w-72 rounded-full bg-brand-gradient blur-[180px]" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-brand-gradient blur-[200px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="rounded-4xl border border-nav-border/50 bg-panel/85 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge
                variant="secondary"
                className="w-fit rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
              >
                {t("badgeTitle")}
              </Badge>
              <div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  {t("pageTitle")}
                </h1>
                <p className="text-sm text-white/70 sm:text-base">
                  {t("pageSubtitle")}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                variant="secondary"
                className="h-12 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/admin/challenges">{t("allChallengesCta")}</Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary hover:opacity-90"
              >
                <Link href="/admin/challenges/new">{t("newChallengeCta")}</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Card className="rounded-4xl border border-white/10 bg-panel/80 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.65)]">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-white">
                  <Sparkles className="h-5 w-5 text-brand-accent" />
                  {t("activeChallengeTitle")}
                </CardTitle>
                {countdown && (
                  <span className="text-sm text-white/70">
                    {t("endsLabel", { countdown })}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/70">
                {t("activeChallengeNote")}
              </p>
            </CardHeader>
            <CardContent>
              {activeChallenge ? (
                <div className="space-y-6 text-white">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {activeChallenge.title}
                    </h2>
                    {activeChallenge.description && (
                      <p className="mt-2 text-sm text-white/70">
                        {activeChallenge.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/80 sm:grid-cols-3">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-white/60">
                        <CalendarRange className="h-4 w-4 text-brand-accent" />
                        {t("startLabel")}
                      </p>
                      <p className="font-medium">
                        {format(new Date(activeChallenge.startDate), "PPP p", {
                          locale: dateLocale,
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-white/60">
                        <CalendarRange className="h-4 w-4 text-brand-accent" />
                        {t("endLabel")}
                      </p>
                      <p className="font-medium">
                        {format(new Date(activeChallenge.endDate), "PPP p", {
                          locale: dateLocale,
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-white/60">
                        <Sparkles className="h-4 w-4 text-brand-accent" />
                        {t("statusLabel")}
                      </p>
                      <p className="font-medium">
                        {countdown
                          ? t("closingLabel", { countdown })
                          : t("tbaLabel")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      className="h-12 rounded-full bg-brand-gradient text-brand-on-primary text-base font-semibold hover:opacity-90"
                    >
                      <Link
                        href={`/admin/challenges/${activeChallenge.id}/edit`}
                      >
                        {t("editChallengeCta")}
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="secondary"
                      className="h-12 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      <Link href={`/admin/photos`}>
                        {t("viewPhotosCta") || "View Photos"}
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/70">
                  <p className="text-lg font-semibold text-white">
                    {t("noActiveChallengeTitle")}
                  </p>
                  <p className="mt-2 text-sm text-white/60">
                    {t("noActiveChallengeDescription")}
                  </p>
                  <Button
                    asChild
                    className="mt-6 h-12 rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary hover:opacity-90"
                  >
                    <Link href="/admin/challenges/new">
                      {t("createChallengeCta")}
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-4xl border border-nav-border/50 bg-panel/80 p-8 text-white shadow-[0_20px_45px_rgba(2,6,23,0.65)]">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                  {t("quickActionsEyebrow") || "QUICK ACTIONS"}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {t("quickActionsTitle") || "Admin Tools"}
                </h2>
                <p className="text-sm text-white/70">
                  {t("quickActionsDescription") || "Manage your platform"}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="h-12 w-full rounded-full bg-brand-gradient text-brand-on-primary text-base font-semibold hover:opacity-90"
                >
                  <Link href="/admin/challenges">
                    {t("manageChallengesCta") || "Manage Challenges"}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="h-12 w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                >
                  <Link href="/admin/photos">
                    {t("managePhotosCta") || "Manage Photos"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {activeChallenge && (
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[28px] border border-nav-border/40 bg-panel/80 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                  {tHome("leaderboardPreviewTitle")}
                </p>
                <Link
                  href="/leaderboard"
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {tHome("leaderboardViewAll")}
                </Link>
              </div>
              {leaderboardPreview.length === 0 ? (
                <p className="mt-5 text-sm text-white/70">
                  {tHome("leaderboardEmpty")}
                </p>
              ) : (
                <ul className="mt-5 space-y-4">
                  {leaderboardPreview.map((entry, index) => (
                    <li
                      key={entry.photoId ?? `${entry.userId}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3 text-white"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-brand-accent" />
                        <span className="text-white/60">{index + 1}.</span>
                        {entry.userName || tPhotos("anonymousUser")}
                      </span>
                      <span className="text-sm text-white/70">
                        {tPhotos("votesLabel", { count: entry.voteCount })}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-[28px] border border-nav-border/40 bg-panel/80 p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                {t("communityStatsTitle") || "COMMUNITY STATS"}
              </p>
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-brand-accent" />
                    <p className="text-3xl font-semibold">
                      {numberFormatter.format(siteStats.totalPhotos)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.4em] text-white/60">
                    {tHome("communityStats.photosSubmitted")}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-brand-accent" />
                    <p className="text-3xl font-semibold">
                      {numberFormatter.format(siteStats.totalMembers)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.4em] text-white/60">
                    {tHome("communityStats.activeMembers")}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/10 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-brand-accent" />
                    <p className="text-3xl font-semibold">
                      {numberFormatter.format(siteStats.totalVotes)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.4em] text-white/60">
                    {tHome("communityStats.votesCast")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-nav-border/40 bg-panel/80 p-6">
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                {t("insightsTitle") || "INSIGHTS"}
              </p>
              <p className="mt-4 text-white/85">
                {t("insightsDescription") ||
                  "Monitor platform activity and engagement metrics to make data-driven decisions."}
              </p>
              <Button
                asChild
                variant="secondary"
                className="mt-6 h-12 w-full rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/admin/photos">
                  {t("viewAnalyticsCta") || "View Analytics"}
                </Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
