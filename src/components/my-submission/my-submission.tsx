// src\components\my-submission\my-submission.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db, schema } from "@/db";
import { and, eq, sql } from "drizzle-orm";
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
      <div className="mt-6 text-sm text-gray-600">
        <p>You haven&apos;t submitted a photo for this challenge yet.</p>
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
