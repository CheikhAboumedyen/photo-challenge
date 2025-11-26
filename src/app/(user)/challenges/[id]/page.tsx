// src/app/(user)/challenges/[id]/page.tsx
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { getPhotosWithVotes } from "./actions";
import { VoteButton } from "@/components/buttons/vote-button";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default async function ChallengeVotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: challengeId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  const challenge = await db.query.challenge.findFirst({
    where: eq(schema.challenge.id, challengeId),
  });
  if (!challenge)
    return (
      <div className="min-h-screen bg-page px-6 py-24 text-center text-brand-foreground">
        Challenge not found.
      </div>
    );

  const photos = await getPhotosWithVotes(challengeId);

  let userVotedPhotoId: string | null = null;
  if (userId) {
    const voteRow = await db
      .select({ photoId: schema.vote.photoId })
      .from(schema.vote)
      .leftJoin(schema.photo, eq(schema.photo.id, schema.vote.photoId))
      .where(
        and(
          eq(schema.vote.userId, userId),
          eq(schema.photo.challengeId, challengeId)
        )
      )
      .limit(1);
    userVotedPhotoId = voteRow[0]?.photoId ?? null;
  }

  return (
    <div className="relative isolate min-h-screen bg-page px-4 py-12 text-brand-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-8%] top-0 h-72 w-72 rounded-full bg-brand-gradient blur-[180px]" />
        <div className="absolute right-[-5%] bottom-[-10%] h-80 w-80 rounded-full bg-brand-gradient blur-[220px]" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="rounded-4xl border border-nav-border/50 bg-panel/85 p-8 shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <Badge
            variant="secondary"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
          >
            Live challenge
          </Badge>
          <div className="mt-4 space-y-3">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {challenge.title}
            </h1>
            {challenge.description && (
              <p className="text-sm text-white/70 sm:text-base">
                {challenge.description}
              </p>
            )}
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-white/60">
            <Sparkles className="h-4 w-4 text-brand-accent" />
            Vote for one photo • your vote helps decide the results
          </p>
        </section>

        {photos.length === 0 ? (
          <div className="rounded-4xl border border-nav-border/40 bg-panel/70 p-10 text-center text-white/70">
            No photos uploaded yet.
          </div>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p) => {
              const isSelf = p.userId === userId;
              const isVoted = p.id === userVotedPhotoId;
              const hasExistingVote = !!userVotedPhotoId;

              return (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-panel/90 shadow-[0_20px_45px_rgba(2,6,23,0.6)]"
                >
                  <div className="relative h-64 w-full">
                    <Image
                      src={p.imageUrl}
                      alt={p.caption || "Photo"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-5 text-white">
                    <div className="space-y-1 text-sm">
                      <p className="text-base font-semibold">
                        {p.userName || "Anonymous"}
                      </p>
                      <p className="text-xs text-white/70">
                        Uploaded{" "}
                        {formatDistanceToNow(new Date(p.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {p.caption && (
                        <p className="text-sm text-white/70 line-clamp-2">
                          {p.caption}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto space-y-2">
                      <VoteButton
                        photoId={p.id}
                        disabled={isSelf}
                        isVoted={isVoted}
                        willSwitch={hasExistingVote && !isVoted}
                      />
                      <p className="text-xs text-white/60">
                        {p.voteCount} vote{p.voteCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
