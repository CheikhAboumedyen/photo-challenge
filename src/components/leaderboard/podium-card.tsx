// src/components/leaderboard/podium-card.tsx
"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Crown } from "lucide-react";

export type PodiumCardProps = {
  userName: string;
  voteCount: number;
  rank: number;
};

export function PodiumCard({ userName, voteCount, rank }: PodiumCardProps) {
  const t = useTranslations("Leaderboard");
  const tiers = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-slate-500 to-slate-700",
    "from-slate-600 to-slate-800",
  ];
  return (
    <div className="relative flex flex-col items-center gap-3 rounded-[28px] border border-white/10 bg-panel/80 p-5 text-center text-white">
      {rank === 1 && (
        <Crown className="absolute -top-4 h-7 w-7 text-brand-accent drop-shadow-lg" />
      )}
      <Avatar className="h-16 w-16 border border-white/30 bg-black/20">
        <AvatarFallback className="text-lg font-semibold text-white/80">
          {userName[0]?.toUpperCase() ?? "C"}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-lg font-semibold">{userName}</p>
        <p className="text-xs text-white/70">
          {t("rowVotesLabel", { count: voteCount })}
        </p>
      </div>
      <div
        className={`mt-2 h-16 w-16 rounded-full bg-linear-to-br ${
          tiers[rank - 1] ?? tiers[2]
        } text-center text-sm font-semibold leading-16`}
      >
        #{rank}
      </div>
    </div>
  );
}
