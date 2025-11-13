// src\app\challenges\[id]\page.tsx
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { getPhotosWithVotes } from "./actions";
import { VoteButton } from "@/components/buttons/vote-button";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

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
    return <div className="text-center py-20">Challenge not found</div>;

  const photos = await getPhotosWithVotes(challengeId);

  //  find which photo the user voted for
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
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          {challenge.title}
        </h1>
        <p className="text-gray-600 mb-8">{challenge.description}</p>

        {photos.length === 0 ? (
          <p className="text-gray-600 text-center">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((p) => {
              const isSelf = p.userId === userId;
              const isVoted = p.id === userVotedPhotoId;

              return (
                <div
                  key={p.id}
                  className="bg-white shadow-sm rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="relative w-full h-56">
                    <Image
                      src={p.imageUrl}
                      alt={p.caption || "Photo"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {p.userName || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded{" "}
                        {formatDistanceToNow(new Date(p.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>

                    <div className="mt-4">
                      <VoteButton
                        photoId={p.id}
                        disabled={isSelf}
                        isVoted={isVoted}
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {p.voteCount} votes
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
