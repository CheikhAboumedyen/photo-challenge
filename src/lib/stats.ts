// src/lib/stats.ts
"use server";

import { db, schema } from "@/db";
import { eq, sql } from "drizzle-orm";

export type SiteStats = {
  totalPhotos: number;
  totalMembers: number;
  totalVotes: number;
};

export async function getSiteStats(): Promise<SiteStats> {
  const [photosResult, membersResult, votesResult] = await Promise.all([
    db
      .select({
        count: sql<number>`COUNT(${schema.photo.id})`,
      })
      .from(schema.photo)
      .where(eq(schema.photo.isHidden, false)),
    db
      .select({
        count: sql<number>`COUNT(${schema.user.id})`,
      })
      .from(schema.user)
      .where(eq(schema.user.role, "user")),
    db
      .select({
        count: sql<number>`COUNT(${schema.vote.id})`,
      })
      .from(schema.vote),
  ]);

  return {
    totalPhotos: photosResult[0]?.count ?? 0,
    totalMembers: membersResult[0]?.count ?? 0,
    totalVotes: votesResult[0]?.count ?? 0,
  };
}
