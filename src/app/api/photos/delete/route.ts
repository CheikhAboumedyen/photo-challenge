// src/app/api/photos/delete/route.ts
import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { id } = await req.json(); // { id: photoId }
    if (!id)
      return NextResponse.json({ error: "Missing photo id" }, { status: 400 });

    const headers = Object.fromEntries(req.headers.entries());
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // ensure this photo belongs to the user
    const rows = await db
      .select()
      .from(schema.photo)
      .where(eq(schema.photo.id, id));
    const photo = rows[0];
    if (!photo)
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });

    if (photo.userId !== userId && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.delete(schema.photo).where(eq(schema.photo.id, id));

    // revalidate
    revalidatePath("/home");
    revalidatePath(`/challenges/${photo.challengeId}`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Delete photo error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
