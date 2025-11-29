// src/app/(user)/leaderboard/page.tsx
import Image from "next/image";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";
import {
  getActiveChallenge,
  getLeaderboardForChallenge,
  getPastChallengesWithTopPhotos,
} from "./actions";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { LeaderboardRow } from "@/components/leaderboard/leaderboard-row";
import { PhotoCard } from "@/components/leaderboard/photo-card";
import { PodiumCard } from "@/components/leaderboard/podium-card";

export default async function LeaderboardPage() {
  const t = await getTranslations("Leaderboard");
  const activeChallenge = await getActiveChallenge();
  const leaderboard = activeChallenge
    ? await getLeaderboardForChallenge(activeChallenge.id)
    : [];
  const pastChallenges = await getPastChallengesWithTopPhotos();

  const winner = leaderboard[0];
  const rest = leaderboard.slice(3);

  return (
    <div className="space-y-12">
      {activeChallenge && (
        <section className="rounded-4xl border border-nav-border/50 bg-panel/90 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Badge
                variant="secondary"
                className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
              >
                {t("liveBadge")}
              </Badge>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                {activeChallenge.title}
              </h1>
              <p className="text-sm text-white/70">{t("liveSubtitle")}</p>
            </div>
            <p className="text-sm text-white/70">
              {format(new Date(activeChallenge.startDate), "MMM dd")} -{" "}
              {format(new Date(activeChallenge.endDate), "MMM dd, yyyy")}
            </p>
          </div>

          {leaderboard.length === 0 ? (
            <p className="mt-6 text-white/70">{t("noVotesYet")}</p>
          ) : (
            <div className="mt-10 flex flex-col gap-8 lg:h-120 lg:flex-row lg:items-stretch lg:min-h-0">
              <div className="flex h-full min-h-0 flex-col gap-5 lg:flex-1">
                <div className="grid gap-4 md:grid-cols-3">
                  {leaderboard.slice(0, 3).map((u, i) => (
                    <PodiumCard
                      key={u.userId}
                      userName={u.userName || t("anonymousUser")}
                      voteCount={u.voteCount}
                      rank={i + 1}
                    />
                  ))}
                </div>
                {/* h-full min-h-0 space-y-3 overflow-y-auto pr-1 scrollbar-soft */}
                {rest.length > 0 && (
                  <div className="flex-1 rounded-[28px] border border-white/10 bg-black/15 p-4 lg:min-h-0">
                    <div className="h-full min-h-0 max-h-80 space-y-3 overflow-y-auto pr-2 scrollbar-soft lg:max-h-full">
                      {rest.map((u, idx) => (
                        <LeaderboardRow
                          key={u.userId}
                          userName={u.userName || t("anonymousUser")}
                          voteCount={u.voteCount}
                          rank={idx + 4}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex h-full min-h-0 flex-col rounded-[28px] border border-white/10 bg-black/15 p-6 text-white shadow-[0_20px_45px_rgba(2,6,23,0.55)] lg:w-full lg:max-w-sm">
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                  {t("winnerSpotlight")}
                </p>
                {winner?.photoUrl ? (
                  <>
                    <p className="mt-2 text-2xl font-semibold">
                      {winner.userName || t("anonymousUser")}
                    </p>
                    <p className="text-sm text-white/70">
                      {winner.photoCaption || t("winnerCaptionFallback")}
                    </p>
                    <div className="mt-5 flex-1 overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={winner.photoUrl}
                        alt={winner.photoCaption || t("winnerPhotoAlt")}
                        width={640}
                        height={400}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-3 text-xs text-white/60">
                      {t("winnerVotesLabel", { count: winner.voteCount })}
                    </p>
                  </>
                ) : (
                  <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 p-6 text-center text-white/70">
                    <Sparkles className="h-6 w-6 text-brand-accent" />
                    <p>{t("winnerNoPhotoTitle")}</p>
                    <p className="text-xs text-white/50">
                      {t("winnerNoPhotoBody")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="rounded-4xl border border-nav-border/40 bg-panel/80 p-8 text-brand-foreground shadow-[0_20px_45px_rgba(2,6,23,0.55)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge
              variant="secondary"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
            >
              {t("archiveBadge")}
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {t("archiveTitle")}
            </h2>
            <p className="text-sm text-white/70">{t("archiveSubtitle")}</p>
          </div>
        </div>

        {pastChallenges.length === 0 ? (
          <p className="mt-6 text-white/70">{t("noPastChallenges")}</p>
        ) : (
          <div className="mt-10 space-y-10">
            {pastChallenges.map((ch) => (
              <div key={ch.challengeId} className="space-y-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">
                      {ch.title}
                    </p>
                    <p className="text-sm text-white/60">
                      {format(new Date(ch.startDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(ch.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <Badge className="w-fit rounded-full border border-white/20 bg-transparent text-xs text-white/70">
                    {t("featuredPhotosBadge", { count: ch.topPhotos.length })}
                  </Badge>
                </div>

                {ch.topPhotos.length === 0 ? (
                  <p className="text-sm text-white/60">
                    {t("noPhotosForChallenge")}
                  </p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ch.topPhotos.map((p) => (
                      <PhotoCard
                        key={p.photoId}
                        imageUrl={p.imageUrl}
                        caption={p.caption || undefined}
                        userName={p.userName || t("anonymousUser")}
                        voteCount={p.voteCount}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
