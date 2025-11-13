"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/app/(user)/profile/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
      className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 flex flex-col gap-6 border border-gray-100"
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          My Profile
        </h1>
        <p className="text-sm text-gray-500">
          Update your personal information
        </p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-200 shadow-sm">
          <Image
            src={preview || "/default-avatar.png"}
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>

        <label className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
          <span className="underline">Change photo</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Full Name</label>
        <Input
          {...form.register("name")}
          placeholder="Your name"
          className="w-full"
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input value={user.email} readOnly className="bg-gray-100" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Role</label>
        <Input value={user.role} readOnly className="bg-gray-100" />
      </div>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="bg-gray-900 hover:bg-black text-white w-full mt-4"
      >
        {form.formState.isSubmitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
