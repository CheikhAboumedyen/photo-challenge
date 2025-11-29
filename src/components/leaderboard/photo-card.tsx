// src/components/leaderboard/photo-card.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type PhotoCardProps = {
  imageUrl: string;
  caption?: string;
  userName: string;
  voteCount: number;
};

export function PhotoCard({
  imageUrl,
  caption,
  userName,
  voteCount,
}: PhotoCardProps) {
  const t = useTranslations("Leaderboard");

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-panel/80 shadow-[0_20px_45px_rgba(2,6,23,0.55)]">
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={caption || t("photoAltFallback")}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-2 p-4 text-sm text-white/80">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-white/20 bg-transparent">
            <AvatarFallback className="text-sm text-white/80">
              {userName[0]?.toUpperCase() ?? "C"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-white">{userName}</p>
            {caption && (
              <p className="text-xs text-white/60 line-clamp-2">{caption}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-white/60">
          {t("photoVotesLabel", { count: voteCount })}
        </p>
      </div>
    </div>
  );
}
