// src/app/api/photos/upload/route.ts
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { db, schema } from "@/db";
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // parse formData
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const caption = (form.get("caption") as string) || "";
    const challengeId = (form.get("challengeId") as string) || "";

    // validate input
    if (!file || !challengeId) {
      return NextResponse.json(
        { error: "Missing file or challengeId" },
        { status: 400 }
      );
    }

    // get session (server-side)
    const headers = Object.fromEntries(req.headers.entries());
    const session = await auth.api.getSession({ headers });

    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    // check one submission per user per challenge

    const existing = await db
      .select()
      .from(schema.photo)
      .where(
        and(
          eq(schema.photo.userId, userId),
          eq(schema.photo.challengeId, challengeId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You already submitted a photo for this challenge" },
        { status: 409 }
      );
    }

    // convert File -> base64 data url
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // upload to Cloudinary (server-side)
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: `photo_challenges/${challengeId}`,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    const imageUrl = uploadResult.secure_url;

    // insert into DB
    await db.insert(schema.photo).values({
      id: uuidv4(),
      userId,
      challengeId,
      imageUrl,
      caption,
      isHidden: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // revalidate pages that depend on photos/challenge
    revalidatePath(`/challenges/${challengeId}`);
    revalidatePath("/home");
    revalidatePath("/");

    return NextResponse.json({ ok: true, imageUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
