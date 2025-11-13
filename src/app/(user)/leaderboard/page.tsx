// src/app/leaderboard/page.tsx
import Image from "next/image";
import { format } from "date-fns";
import {
  getActiveChallenge,
  getLeaderboardForChallenge,
  getPastChallengesWithTopPhotos,
} from "./actions";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function PodiumCard({
  userName,
  voteCount,
  rank,
}: {
  userName: string;
  voteCount: number;
  rank: number;
}) {
  const sizes = ["h-36", "h-32", "h-28"]; // 1st tallest
  const size = sizes[rank - 1] || "h-28";
  return (
    <div className="flex flex-col items-center">
      <Avatar className={`w-20 h-20 border-4 border-gray-200 shadow-md`}>
        <AvatarFallback className="text-lg font-semibold text-gray-800">
          {userName[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <p className="mt-3 font-medium text-gray-800">{userName}</p>
      <Badge className="mt-1 bg-gray-100 text-gray-700 text-xs">
        {voteCount} votes
      </Badge>
      <div
        className={`mt-3 w-14 ${size} rounded-t-xl bg-gray-200 flex items-center justify-center text-gray-700 font-semibold`}
      >
        #{rank}
      </div>
    </div>
  );
}

function LeaderboardRow({
  userName,
  voteCount,
  rank,
}: {
  userName: string;
  voteCount: number;
  rank: number;
}) {
  return (
    <Card className="flex items-center justify-between p-4 rounded-xl hover:shadow-sm transition">
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10 bg-gray-100">
          <AvatarFallback className="text-sm text-gray-800 font-medium">
            {userName[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-gray-800">{userName}</p>
          <p className="text-xs text-gray-500">Rank #{rank}</p>
        </div>
      </div>
      <Badge className="bg-gray-100 text-gray-700">{voteCount} votes</Badge>
    </Card>
  );
}

function PhotoCard({
  imageUrl,
  caption,
  userName,
  voteCount,
}: {
  imageUrl: string;
  caption?: string;
  userName: string;
  voteCount: number;
}) {
  return (
    <Card className="overflow-hidden rounded-2xl hover:shadow-md transition">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={caption || "Photo"}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 bg-gray-100">
            <AvatarFallback className="text-sm text-gray-800">
              {userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-800">{userName}</p>
            {caption && (
              <p className="text-xs text-gray-500 truncate">{caption}</p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-600">{voteCount} votes</p>
      </CardContent>
    </Card>
  );
}

export default async function LeaderboardPage() {
  const activeChallenge = await getActiveChallenge();
  const leaderboard = activeChallenge
    ? await getLeaderboardForChallenge(activeChallenge.id)
    : [];
  const pastChallenges = await getPastChallengesWithTopPhotos();

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Active Challenge Section */}
        {activeChallenge && (
          <section>
            <h1 className="text-3xl font-semibold text-gray-900 mb-6">
              Leaderboard — {activeChallenge.title}
            </h1>

            {leaderboard.length === 0 ? (
              <p className="text-gray-600">No votes yet.</p>
            ) : (
              <>
                {/* Podium */}
                <div className="flex items-end justify-center gap-8 mb-10">
                  {leaderboard.slice(0, 3).map((u, i) => (
                    <PodiumCard
                      key={u.userId}
                      userName={u.userName || "Anonymous"}
                      voteCount={u.voteCount}
                      rank={i + 1}
                    />
                  ))}
                </div>

                {/* Rest of leaderboard */}
                <div className="space-y-2">
                  {leaderboard.slice(3).map((u, idx) => (
                    <LeaderboardRow
                      key={u.userId}
                      userName={u.userName || "Anonymous"}
                      voteCount={u.voteCount}
                      rank={idx + 4}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        {/* Archive Section */}
        <section>
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Past Challenges
          </h1>
          {pastChallenges.length === 0 ? (
            <p className="text-gray-600">No past challenges yet.</p>
          ) : (
            <div className="space-y-10">
              {pastChallenges.map((ch) => (
                <div key={ch.challengeId}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {ch.title}
                    </h2>
                    <Badge className="bg-gray-200 text-gray-700">
                      {format(new Date(ch.startDate), "MMM dd, yyyy")} —{" "}
                      {format(new Date(ch.endDate), "MMM dd, yyyy")}
                    </Badge>
                  </div>
                  {ch.topPhotos.length === 0 ? (
                    <p className="text-gray-600">No photos uploaded.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {ch.topPhotos.map((p) => (
                        <PhotoCard
                          key={p.photoId}
                          imageUrl={p.imageUrl}
                          caption={p.caption || undefined}
                          userName={p.userName || "Anonymous"}
                          voteCount={p.voteCount}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
