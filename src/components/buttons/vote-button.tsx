// src\components\buttons\vote-button.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { voteAction } from "@/app/(user)/challenges/[id]/actions";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface VoteButtonProps {
  photoId: string;
  disabled?: boolean;
  isVoted?: boolean;
  willSwitch?: boolean;
}

export function VoteButton({
  photoId,
  disabled,
  isVoted,
  willSwitch,
}: VoteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function executeVote() {
    startTransition(async () => {
      try {
        await voteAction(photoId);
        toast.success("Vote updated!");
        router.refresh(); // forces full re-render with new data
      } catch (err: any) {
        toast.error(err.message || "Vote failed");
      } finally {
        setConfirmOpen(false);
      }
    });
  }

  function handleClick() {
    if (disabled || isPending) return;

    if (isVoted) {
      executeVote();
      return;
    }

    if (willSwitch) {
      setConfirmOpen(true);
      return;
    }

    executeVote();
  }

  return (
    <>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch your vote?</AlertDialogTitle>
            <AlertDialogDescription>
              You already voted for another photo in this challenge. Your vote
              will move to this photo instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isPending} onClick={executeVote}>
              {isPending ? "Switching..." : "Switch vote"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        onClick={handleClick}
        disabled={isPending || disabled}
        className={`
    w-full rounded-full font-semibold transition-all
    ${
      disabled
        ? "bg-gray-600/40 text-gray-300 cursor-not-allowed"
        : isVoted
        ? "bg-white/10 text-white hover:bg-white/20"
        : "bg-brand-gradient text-white shadow-md hover:opacity-90"
    }
  `}
      >
        {isPending
          ? "Processing..."
          : disabled
          ? "your own"
          : isVoted
          ? "Unvote"
          : "Vote"}
      </Button>
    </>
  );
}
