"use server";

import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { headers } from "next/headers";

export async function getProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const user = await db.query.user.findFirst({
    where: eq(schema.user.id, session.user.id),
  });

  if (!user) throw new Error("User not found");
  return user;
}

export async function updateProfile(formData: FormData): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const userId = session.user.id;
  const name = formData.get("name")?.toString()?.trim() ?? "";
  const file = formData.get("image") as File | null;

  let imageUrl: string | undefined;

  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

    const upload = await cloudinary.uploader.upload(dataUri, {
      folder: `profiles/${userId}`,
      resource_type: "image",
      use_filename: true,
      unique_filename: true,
      overwrite: true,
    });

    imageUrl = upload.secure_url;
  }

  await db
    .update(schema.user)
    .set({
      ...(name ? { name } : {}),
      ...(imageUrl ? { image: imageUrl } : {}),
      updatedAt: new Date(),
    })
    .where(eq(schema.user.id, userId));

  revalidatePath("/profile");
}
