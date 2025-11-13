"use server";

import { db, schema } from "@/db";
import { lte, gte, eq, sql, and, desc } from "drizzle-orm";

// Fetch active challenge
export async function getActiveChallenge() {
  const now = new Date();
  const rows = await db
    .select()
    .from(schema.challenge)
    .where(
      and(
        lte(schema.challenge.startDate, now),
        gte(schema.challenge.endDate, now)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

// Fetch leaderboard for a challenge (top 3 users by votes)
export async function getLeaderboardForChallenge(challengeId: string) {
  const rows = await db
    .select({
      userId: schema.user.id,
      userName: schema.user.name,
      voteCount: sql<number>`COUNT(${schema.vote.id})`.as("vote_count"),
    })
    .from(schema.vote)
    .leftJoin(schema.photo, eq(schema.photo.id, schema.vote.photoId))
    .leftJoin(schema.user, eq(schema.user.id, schema.photo.userId))
    .where(
      and(
        eq(schema.photo.challengeId, challengeId),
        eq(schema.photo.isHidden, false)
      )
    )
    .groupBy(schema.user.id, schema.user.name)
    .orderBy(sql`COUNT(${schema.vote.id}) DESC`)
    .limit(3);

  return rows;
}

// Fetch past challenges with top 3 photos each
export async function getPastChallengesWithTopPhotos() {
  const now = new Date();
  const challenges = await db
    .select()
    .from(schema.challenge)
    .where(lte(schema.challenge.endDate, now))
    .orderBy(sql`${schema.challenge.endDate} DESC`);

  const results = [];

  for (const ch of challenges) {
    const topPhotos = await db
      .select({
        photoId: schema.photo.id,
        imageUrl: schema.photo.imageUrl,
        caption: schema.photo.caption,
        userName: schema.user.name,
        voteCount: sql<number>`COUNT(${schema.vote.id})`.as("vote_count"),
      })
      .from(schema.photo)
      .leftJoin(schema.user, eq(schema.user.id, schema.photo.userId))
      .leftJoin(schema.vote, eq(schema.vote.photoId, schema.photo.id))
      .where(
        and(
          eq(schema.photo.challengeId, ch.id),
          eq(schema.photo.isHidden, false)
        )
      )
      .groupBy(schema.photo.id, schema.user.name)
      .orderBy(sql`COUNT(${schema.vote.id}) DESC`)
      .limit(3);

    results.push({
      challengeId: ch.id,
      title: ch.title,
      startDate: ch.startDate,
      endDate: ch.endDate,
      topPhotos,
    });
  }

  return results;
}
