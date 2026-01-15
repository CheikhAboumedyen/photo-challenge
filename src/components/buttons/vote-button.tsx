// src\components\buttons\vote-button.tsx
"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { voteAction } from "@/app/(user)/challenges/[id]/actions";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
  const t = useTranslations("VoteButton");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function executeVote() {
    startTransition(async () => {
      try {
        await voteAction(photoId);
        toast.success(t("toastUpdated"));
        router.refresh(); // forces full re-render with new data
      } catch (err: any) {
        toast.error(err.message || t("toastFailed"));
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
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("dialogTitle")}
        description={t("dialogDescription")}
        cancelLabel={t("cancel")}
        confirmLabel={isPending ? t("switching") : t("switchVote")}
        onConfirm={executeVote}
        isPending={isPending}
      />

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
          ? t("processing")
          : disabled
          ? t("yourOwn")
          : isVoted
          ? t("unvote")
          : t("vote")}
      </Button>
    </>
  );
}
