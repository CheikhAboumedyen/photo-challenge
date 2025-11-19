// src/app/(user)/leaderboard/page.tsx
import Image from "next/image";
import { format } from "date-fns";
import {
  getActiveChallenge,
  getLeaderboardForChallenge,
  getPastChallengesWithTopPhotos,
} from "./actions";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown, Sparkles } from "lucide-react";

function PodiumCard({
  userName,
  voteCount,
  rank,
}: {
  userName: string;
  voteCount: number;
  rank: number;
}) {
  const tiers = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-slate-500 to-slate-700",
    "from-slate-600 to-slate-800",
  ];
  return (
    <div className="relative flex flex-col items-center gap-4 rounded-[28px] border border-white/10 bg-panel/80 p-6 text-center text-white">
      {rank === 1 && (
        <Crown className="absolute -top-4 h-7 w-7 text-brand-accent drop-shadow-lg" />
      )}
      <Avatar className="h-16 w-16 border border-white/30 bg-black/20">
        <AvatarFallback className="text-lg font-semibold text-white/80">
          {userName[0]?.toUpperCase() ?? "C"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-lg font-semibold">{userName}</p>
        <p className="text-xs text-white/70">{voteCount} votes</p>
      </div>
      <div
        className={`mt-2 h-16 w-16 rounded-full bg-linear-to-br ${
          tiers[rank - 1] ?? tiers[2]
        } text-center text-sm font-semibold leading-16`}
      >
        #{rank}
      </div>
    </div>
  );
}

function LeaderboardRow({
  userName,
  voteCount,
  rank,
}: {
  userName: string;
  voteCount: number;
  rank: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-white/20 bg-transparent">
          <AvatarFallback className="text-sm text-white/80 font-medium">
            {userName[0]?.toUpperCase() ?? "C"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-xs text-white/60">Rank #{rank}</p>
        </div>
      </div>
      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
        {voteCount} votes
      </span>
    </div>
  );
}

function PhotoCard({
  imageUrl,
  caption,
  userName,
  voteCount,
}: {
  imageUrl: string;
  caption?: string;
  userName: string;
  voteCount: number;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-panel/80 shadow-[0_20px_45px_rgba(2,6,23,0.55)]">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={caption || "Photo"}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-2 p-4 text-sm text-white/80">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-white/20 bg-transparent">
            <AvatarFallback className="text-sm	text-white/80">
              {userName[0]?.toUpperCase() ?? "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white">{userName}</p>
            {caption && (
              <p className="text-xs text-white/60 line-clamp-2">{caption}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-white/60">{voteCount} votes</p>
      </div>
    </div>
  );
}

export default async function LeaderboardPage() {
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
                Live leaderboard
              </Badge>
              <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
                {activeChallenge.title}
              </h1>
              <p className="text-sm text-white/70">
                Tracking every vote for this week’s portrait brief.
              </p>
            </div>
            <p className="text-sm text-white/70">
              {format(new Date(activeChallenge.startDate), "MMM dd")} –{" "}
              {format(new Date(activeChallenge.endDate), "MMM dd, yyyy")}
            </p>
          </div>

          {leaderboard.length === 0 ? (
            <p className="mt-6 text-white/70">No votes yet.</p>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {leaderboard.slice(0, 3).map((u, i) => (
                    <PodiumCard
                      key={u.userId}
                      userName={u.userName || "Anonymous"}
                      voteCount={u.voteCount}
                      rank={i + 1}
                    />
                  ))}
                </div>

                {rest.length > 0 && (
                  <div className="rounded-[28px] border border-white/10 bg-black/15 p-5 space-y-3">
                    {rest.map((u, idx) => (
                      <LeaderboardRow
                        key={u.userId}
                        userName={u.userName || "Anonymous"}
                        voteCount={u.voteCount}
                        rank={idx + 4}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/15 p-6 text-white shadow-[0_20px_45px_rgba(2,6,23,0.55)]">
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">
                  Winner spotlight
                </p>
                {winner?.photoUrl ? (
                  <>
                    <p className="mt-2 text-2xl font-semibold">
                      {winner.userName || "Anonymous"}
                    </p>
                    <p className="text-sm text-white/70">
                      {winner.photoCaption || "Untitled portrait"}
                    </p>
                    <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                      <Image
                        src={winner.photoUrl}
                        alt={winner.photoCaption || "Winning photo"}
                        width={640}
                        height={400}
                        className="h-72 w-full object-cover"
                      />
                    </div>
                    <p className="mt-3 text-xs text-white/60">
                      {winner.voteCount} votes · Challenge leader
                    </p>
                  </>
                ) : (
                  <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/20 p-6 text-center text-white/70">
                    <Sparkles className="h-6 w-6 text-brand-accent" />
                    <p>No photo found for the current leader yet.</p>
                    <p className="text-xs text-white/50">
                      The top portrait will be featured here once it’s uploaded.
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
              Archive highlights
            </Badge>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              Past challenges
            </h2>
            <p className="text-sm text-white/70">
              Study the strongest uploads to prep for the next drop.
            </p>
          </div>
        </div>

        {pastChallenges.length === 0 ? (
          <p className="mt-6 text-white/70">No past challenges yet.</p>
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
                      {format(new Date(ch.startDate), "MMM dd, yyyy")} –{" "}
                      {format(new Date(ch.endDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <Badge className="w-fit rounded-full border border-white/20 bg-transparent text-xs text-white/70">
                    {ch.topPhotos.length} featured photos
                  </Badge>
                </div>

                {ch.topPhotos.length === 0 ? (
                  <p className="text-sm text-white/60">No photos uploaded.</p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {ch.topPhotos.map((p) => (
                      <PhotoCard
                        key={p.photoId}
                        imageUrl={p.imageUrl}
                        caption={p.caption || undefined}
                        userName={p.userName || "Anonymous"}
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
