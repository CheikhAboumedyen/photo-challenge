"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { voteAction } from "@/app/(user)/challenges/[id]/actions";
import { useRouter } from "next/navigation";

interface VoteButtonProps {
  photoId: string;
  disabled?: boolean;
  isVoted?: boolean;
}

export function VoteButton({ photoId, disabled, isVoted }: VoteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleVote() {
    startTransition(async () => {
      try {
        await voteAction(photoId);
        toast.success("Vote updated!");
        router.refresh(); // forces full re-render with new data
      } catch (err: any) {
        toast.error(err.message || "Vote failed");
      }
    });
  }

  return (
    <Button
      onClick={handleVote}
      disabled={isPending || disabled}
      className={`w-full transition-all ${
        isVoted
          ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
          : "bg-gray-900 hover:bg-black text-white"
      }`}
    >
      {isPending
        ? "Processing..."
        : disabled
        ? "your own"
        : isVoted
        ? "Unvote"
        : "Vote"}
    </Button>
  );
}
