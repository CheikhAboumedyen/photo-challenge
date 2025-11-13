// src/app/challenges/[id]/upload/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function UploadPage() {
  const params = useParams();
  const challengeId = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id || "";
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please choose an image to upload.");
      return;
    }
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("caption", caption);
      fd.append("challengeId", challengeId);

      const res = await fetch("/api/photos/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Upload failed");
        setLoading(false);
        return;
      }

      toast.success("Photo uploaded successfully!");
      router.push("/home");
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-start justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-3xl">
        <Card className="p-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Upload Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-gray-700">Image</label>
                <Input type="file" accept="image/*" onChange={onFileChange} />
                <p className="text-sm text-gray-500">
                  One image per challenge. Recommended: JPEG or PNG.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700">
                  Caption (optional)
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/home")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gray-900 text-white"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload Photo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
