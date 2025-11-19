"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateProfile } from "@/app/(user)/profile/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  name: z.string().min(2, "Name is too short").max(50),
  image: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(user.image || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name },
  });

  async function onSubmit(values: ProfileFormValues) {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.image && values.image[0]) {
      formData.append("image", values.image[0]);
    }

    try {
      await updateProfile(formData);
      toast.success("Profile updated!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", e.target.files);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto w-full max-w-xl space-y-8 rounded-4xl border border-nav-border/50 bg-panel/90 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]"
    >
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">
          Profile
        </p>
        <h1 className="mt-3 text-3xl font-semibold">Your creator identity</h1>
        <p className="text-sm text-white/70">
          Update your name, avatar, and review the details tied to your
          submissions.
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-nav-border/70">
          <Image
            src={preview || "/default-avatar.png"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
        <label className="text-sm font-medium text-white/80 transition hover:text-white">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Full name</label>
          <Input
            {...form.register("name")}
            placeholder="Your name"
            className="h-12 border-nav-border/50 bg-transparent text-brand-foreground placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-400">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-white/70">
            Email
            <Input
              value={user.email}
              readOnly
              className="h-12 border-nav-border/30 bg-white/5 text-white/80"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-white/70">
            Role
            <Input
              value={user.role}
              readOnly
              className="h-12 border-nav-border/30 bg-white/5 text-white/80"
            />
          </label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="h-12 w-full rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary transition hover:opacity-90"
      >
        {form.formState.isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
