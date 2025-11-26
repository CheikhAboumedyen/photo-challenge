"use server";
import { auth } from "@/lib/auth/auth";
import { db, schema } from "@/db";
import { eq, sql, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function voteAction(photoId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const photo = await db.query.photo.findFirst({
    where: eq(schema.photo.id, photoId),
  });
  if (!photo) throw new Error("Photo not found");

  if (photo.userId === userId) {
    throw new Error("You cannot vote for your own photo");
  }

  // find existing vote in this challenge (if any)
  const existing = await db
    .select({
      voteId: schema.vote.id,
      votedPhotoId: schema.vote.photoId,
    })
    .from(schema.vote)
    .leftJoin(schema.photo, eq(schema.photo.id, schema.vote.photoId))
    .where(
      and(
        eq(schema.vote.userId, userId),
        eq(schema.photo.challengeId, photo.challengeId)
      )
    )
    .limit(1);

  const existingRow = existing[0] ?? null;
  const previousVotedPhotoId = existingRow ? existingRow.votedPhotoId : null;

  if (existingRow) {
    // If they voted same photo -> unvote
    if (existingRow.votedPhotoId === photoId) {
      await db
        .delete(schema.vote)
        .where(eq(schema.vote.id, existingRow.voteId));
      revalidatePath(`/challenges/${photo.challengeId}`);
      return { status: "unvoted", previousVotedPhotoId };
    }

    // If they voted different photo -> delete previous vote (we'll insert new)
    await db.delete(schema.vote).where(eq(schema.vote.id, existingRow.voteId));
  }

  // Insert the new vote
  await db.insert(schema.vote).values({ userId, photoId });

  revalidatePath(`/challenges/${photo.challengeId}`);

  return {
    status: existingRow ? "switched" : "voted",
    previousVotedPhotoId,
  };
}

//  Fetch only visible photos + show user name
export async function getPhotosWithVotes(challengeId: string) {
  const rows = await db
    .select({
      id: schema.photo.id,
      imageUrl: schema.photo.imageUrl,
      caption: schema.photo.caption,
      userId: schema.photo.userId,
      createdAt: schema.photo.createdAt,
      userName: schema.user.name, //  get name instead of email
      voteCount: sql<number>`COUNT(${schema.vote.id})`.as("vote_count"),
    })
    .from(schema.photo)
    .leftJoin(schema.user, eq(schema.user.id, schema.photo.userId))
    .leftJoin(schema.vote, eq(schema.vote.photoId, schema.photo.id))
    .where(
      and(
        eq(schema.photo.challengeId, challengeId),
        eq(schema.photo.isHidden, false) // filter out hidden photos
      )
    )
    .groupBy(schema.photo.id, schema.user.name)
    // .orderBy(sql`COUNT(${schema.vote.id}) DESC`);
    .orderBy(sql`${schema.photo.createdAt} DESC`);

  return rows;
}
