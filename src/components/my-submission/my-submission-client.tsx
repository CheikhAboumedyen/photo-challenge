"use client";

import Link from "next/link";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MySubmissionClient({
  photo,
}: {
  photo: {
    id: string;
    imageUrl: string;
    caption: string | null;
    createdAt: string;
    votes: number | null;
    challengeId: string;
  };
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/photos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photo.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success("Photo deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="rounded-4xl border border-nav-border/40 bg-panel/90 p-6 text-brand-foreground shadow-[0_20px_45px_rgba(2,6,23,0.65)]">
      <div className="flex flex-col gap-5 lg:flex-row">
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/20 lg:w-56">
          <img
            src={photo.imageUrl}
            alt={photo.caption || "My submission"}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              My submission
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-white">
              {photo.caption || "Untitled portrait"}
            </h3>
            <p className="text-sm text-white/70">
              Submitted{" "}
              {formatDistanceToNowStrict(new Date(photo.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-2 text-sm">
              Votes{" "}
              <span className="font-semibold text-white">
                {photo.votes ?? 0}
              </span>
            </div>
            <Button
              asChild
              variant="secondary"
              className="rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              <Link href={`/challenges/${photo.challengeId}`}>
                View my submission
              </Link>
            </Button>
          </div>

          <div className="pt-2">
            <ConfirmDialog
              trigger={
                <Button
                  variant="outline"
                  className="rounded-full border border-white/30 bg-transparent text-white/80 hover:bg-white/10"
                >
                  Delete
                </Button>
              }
              title="Confirm Deletion"
              description="This action cannot be undone. Are you sure you want to delete this photo?"
              cancelLabel="Cancel"
              confirmLabel="Delete"
              onConfirm={handleDelete}
              isPending={isDeleting}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
