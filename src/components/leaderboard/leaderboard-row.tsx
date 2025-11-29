// src/components/leaderboard/leaderboard-row.tsx
"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type LeaderboardRowProps = {
  userName: string;
  voteCount: number;
  rank: number;
};

export function LeaderboardRow({ userName, voteCount, rank }: LeaderboardRowProps) {
  const t = useTranslations("Leaderboard");

  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-white/20 bg-transparent">
          <AvatarFallback className="text-sm text-white/80 font-medium">
            {userName[0]?.toUpperCase() ?? "C"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{userName}</p>
          <p className="text-xs text-white/60">{t("rowRankLabel", { rank })}</p>
        </div>
      </div>
      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
        {t("rowVotesLabel", { count: voteCount })}
      </span>
    </div>
  );
}
