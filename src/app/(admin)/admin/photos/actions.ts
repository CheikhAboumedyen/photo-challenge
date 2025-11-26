"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth/auth";
import { db, schema } from "@/db";
import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

type PhotoItem = {
  id: string;
  imageUrl: string;
  caption: string | null;
  isHidden: boolean;
  createdAt: Date;
  userId: string;
  userName: string;
  voteCount: number;
};

type ChallengeGroup = {
  challengeId: string;
  challengeTitle: string;
  photos: PhotoItem[];
};
/** Ensure the current user is admin */
async function ensureAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") redirect("/");
  return session.user.id;
}

/** Get all photos grouped by challenge, including user name and votes */
export async function getAllPhotosGroupedByChallenge() {
  const photos = await db
    .select({
      photoId: schema.photo.id,
      imageUrl: schema.photo.imageUrl,
      caption: schema.photo.caption,
      isHidden: schema.photo.isHidden,
      createdAt: schema.photo.createdAt,
      userId: schema.photo.userId,
      challengeId: schema.photo.challengeId,
      userName: schema.user.name, //use username
      challengeTitle: schema.challenge.title,
    })
    .from(schema.photo)
    .leftJoin(schema.user, eq(schema.user.id, schema.photo.userId))
    .leftJoin(
      schema.challenge,
      eq(schema.challenge.id, schema.photo.challengeId)
    )
    .orderBy(sql`${schema.photo.createdAt} DESC`);

  const votes = await db
    .select({
      photoId: schema.vote.photoId,
      cnt: sql<number>`count(*)`,
    })
    .from(schema.vote)
    .groupBy(schema.vote.photoId);

  const voteMap = new Map<string, number>();
  votes.forEach((v: any) => voteMap.set(String(v.photoId), Number(v.cnt)));

  const grouped = new Map<string, ChallengeGroup>();

  photos.forEach((p: any) => {
    const cid = String(p.challengeId);
    const group = grouped.get(cid) ?? {
      challengeId: cid,
      challengeTitle: p.challengeTitle ?? "Untitled challenge",
      photos: [] as PhotoItem[],
    };

    group.photos.push({
      id: String(p.photoId),
      imageUrl: p.imageUrl,
      caption: p.caption,
      isHidden: Boolean(p.isHidden),
      createdAt: p.createdAt,
      userId: String(p.userId),
      userName: p.userName ?? "Anonymous",
      voteCount: voteMap.get(String(p.photoId)) ?? 0,
    });

    grouped.set(cid, group);
  });

  return Array.from(grouped.values()).sort((a, b) =>
    a.challengeTitle.localeCompare(b.challengeTitle)
  );
}

/** Toggle hide/unhide */
export async function toggleHide(formData: FormData) {
  await ensureAdmin();
  const photoId = formData.get("photoId") as string;
  if (!photoId) throw new Error("Missing photoId");

  const curr = await db
    .select({ isHidden: schema.photo.isHidden })
    .from(schema.photo)
    .where(eq(schema.photo.id, photoId))
    .limit(1);

  const isHidden = curr[0]?.isHidden ?? false;

  await db
    .update(schema.photo)
    .set({ isHidden: !isHidden })
    .where(eq(schema.photo.id, photoId));

  revalidatePath("/admin/photos");
}

/** Delete a photo */
export async function deletePhoto(formData: FormData) {
  await ensureAdmin();
  const photoId = formData.get("photoId") as string;
  if (!photoId) throw new Error("Missing photoId");

  await db.delete(schema.photo).where(eq(schema.photo.id, photoId));
  revalidatePath("/admin/photos");
}
