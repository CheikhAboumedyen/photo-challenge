// src/app/(user)/challenges/[id]/upload/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Camera, Clock, Upload as UploadIcon } from "lucide-react";

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
    <div className="relative isolate min-h-screen bg-page px-4 py-12 text-brand-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-10%] top-10 h-72 w-72 rounded-full bg-brand-gradient blur-[200px]" />
        <div className="absolute right-[-5%] bottom-[-10%] h-80 w-80 rounded-full bg-brand-gradient blur-[240px]" />
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <section className="rounded-4xl border border-nav-border/50 bg-panel/80 p-8 shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <Badge
            variant="secondary"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
          >
            Weekly upload
          </Badge>

          <div className="mt-4 space-y-3">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Share your portrait story
            </h1>
            <p className="text-sm text-white/70 sm:text-base">
              One photo per creator per brief. Include a caption with lighting
              notes so voters get the full context.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/80">
              <UploadIcon className="h-4 w-4 text-brand-accent" />
              JPEG/PNG • up to 10MB • color or monochrome welcome
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/80">
              <Camera className="h-4 w-4 text-brand-accent" />
              Attach gear, lighting cues, or story elements in the caption
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/80">
              <Clock className="h-4 w-4 text-brand-accent" />
              Submit before voting opens—late uploads roll to the next brief
            </div>
          </div>
        </section>

        <section className="rounded-4xl border border-nav-border/50 bg-panel/90 shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <Card className="border-none bg-transparent text-brand-foreground shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-semibold text-white">
                Upload photo
              </CardTitle>
              <p className="text-sm text-white/70">
                Your submission will appear in the challenge gallery once the
                upload completes.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Image
                  </label>
                  <div className="rounded-2xl border border-dashed border-white/20 bg-black/10 p-4 text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="file:mr-4 file:rounded-full file:border-0 file:bg-brand-gradient file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-on-primary text-sm text-white/80"
                    />
                    {file ? (
                      <p className="mt-2 text-xs text-white/60">{file.name}</p>
                    ) : (
                      <p className="mt-2 text-xs text-white/60">
                        Drag & drop or click to choose a file.
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-white/60">
                    One image per challenge. Recommended: JPEG or PNG with
                    plenty of detail.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Caption (optional)
                  </label>
                  <Textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Lighting setup, lens, story inspiration…"
                    className="min-h-[140px] border-nav-border/50 bg-transparent text-white placeholder:text-white/40 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/home")}
                    disabled={loading}
                    className="h-12 flex-1 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10 sm:flex-none sm:px-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 flex-1 rounded-full bg-brand-gradient text-brand-on-primary text-base font-semibold hover:opacity-90 sm:flex-none sm:px-8"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload photo"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
