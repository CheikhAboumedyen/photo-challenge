// src\app\(admin)\admin\challenges\actions.ts
"use server";

import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Fetch all challenges ordered by start date (newest first)

export async function getChallenges() {
  try {
    const challenges = await db
      .select()
      .from(schema.challenge)
      .orderBy(desc(schema.challenge.startDate));
    return challenges;
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw new Error("Failed to load challenges");
  }
}

// Fetch a single challenge by ID

export async function getChallengeById(id: string) {
  try {
    const [challenge] = await db
      .select()
      .from(schema.challenge)
      .where(eq(schema.challenge.id, id))
      .limit(1);
    return challenge || null;
  } catch (error) {
    console.error("Error fetching challenge:", error);
    throw new Error("Failed to fetch challenge");
  }
}

// Create a new challenge

export async function createChallenge(data: {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
}) {
  try {
    const description = (data.description ?? "").slice(0, 50);

    await db.insert(schema.challenge).values({
      title: data.title,
      description,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });

    // Revalidate the admin list page so it updates instantly
    revalidatePath("/admin/challenges");
    return { success: true };
  } catch (error) {
    console.error("Error creating challenge:", error);
    throw new Error("Failed to create challenge");
  }
}

// Update an existing challenge

export async function updateChallenge(
  id: string,
  data: {
    title?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  try {
    const description = data.description?.slice(0, 50);

    await db
      .update(schema.challenge)
      .set({
        ...(data.title && { title: data.title }),
        ...(description !== undefined && { description }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
      })
      .where(eq(schema.challenge.id, id));

    revalidatePath("/admin/challenge");
    return { success: true };
  } catch (error) {
    console.error("Error updating challenge:", error);
    throw new Error("Failed to update challenge");
  }
}

// Delete a challenge by ID

export async function deleteChallenge(id: string) {
  try {
    await db.delete(schema.challenge).where(eq(schema.challenge.id, id));
    revalidatePath("/admin/challenge");
    return { success: true };
  } catch (error) {
    console.error("Error deleting challenge:", error);
    throw new Error("Failed to delete challenge");
  }
}
