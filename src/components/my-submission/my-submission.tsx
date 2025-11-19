import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, schema } from "@/db";
import { and, eq, sql } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import MySubmissionClient from "./my-submission-client";

export default async function MySubmission({
  challengeId,
}: {
  challengeId: string;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const userId = session.user.id;

  const rows = await db
    .select({
      id: schema.photo.id,
      imageUrl: schema.photo.imageUrl,
      caption: schema.photo.caption,
      createdAt: schema.photo.createdAt,
      votes: sql<number>`COUNT(${schema.vote.id})`.as("votes"),
      challengeId: schema.photo.challengeId,
    })
    .from(schema.photo)
    .leftJoin(schema.vote, eq(schema.vote.photoId, schema.photo.id))
    .where(
      and(
        eq(schema.photo.userId, userId),
        eq(schema.photo.challengeId, challengeId)
      )
    )
    .groupBy(schema.photo.id)
    .limit(1);

  const photo = rows[0];
  if (!photo) {
    return (
      <div className="rounded-4xl border border-nav-border/40 bg-panel/80 p-6 text-brand-foreground shadow-[0_20px_45px_rgba(2,6,23,0.65)]">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">
          My submission
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">
          No upload yet
        </h3>
        <p className="text-sm text-white/70">
          You haven&apos;t submitted for this brief. Upload one image with
          lighting and story notes to join voting.
        </p>
        <Button
          asChild
          className="mt-6 h-11 w-full rounded-full bg-brand-gradient text-brand-on-primary hover:opacity-90"
        >
          <Link href={`/challenges/${challengeId}/upload`}>
            Upload your photo
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <MySubmissionClient
      photo={{
        ...photo,
        createdAt: photo.createdAt.toISOString(),
      }}
    />
  );
}
