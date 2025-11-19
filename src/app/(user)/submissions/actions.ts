"use server";

import { db, schema } from "@/db";
import { and, eq, lte, inArray } from "drizzle-orm";

export async function getPastChallengeSubmissions() {
  const now = new Date();

  const challenges = await db
    .select({
      id: schema.challenge.id,
      title: schema.challenge.title,
      description: schema.challenge.description,
      startDate: schema.challenge.startDate,
      endDate: schema.challenge.endDate,
    })
    .from(schema.challenge)
    .where(lte(schema.challenge.endDate, now))
    .orderBy(schema.challenge.endDate);

  if (challenges.length === 0) return [];

  const challengeIds = challenges.map((c) => c.id);

  const photos = await db
    .select({
      id: schema.photo.id,
      imageUrl: schema.photo.imageUrl,
      caption: schema.photo.caption,
      createdAt: schema.photo.createdAt,
      userName: schema.user.name,
      challengeId: schema.photo.challengeId,
      isHidden: schema.photo.isHidden,
    })
    .from(schema.photo)
    .leftJoin(schema.user, eq(schema.user.id, schema.photo.userId))
    .where(
      and(
        inArray(schema.photo.challengeId, challengeIds),
        eq(schema.photo.isHidden, false)
      )
    )
    .orderBy(schema.photo.createdAt);

  const grouped = challenges.map((challenge) => ({
    challenge,
    photos: photos
      .filter((photo) => photo.challengeId === challenge.id)
      .map((photo) => ({
        id: photo.id,
        imageUrl: photo.imageUrl,
        caption: photo.caption,
        createdAt: photo.createdAt,
        userName: photo.userName || "Anonymous",
      })),
  }));

  return grouped.filter((group) => group.photos.length > 0);
}
