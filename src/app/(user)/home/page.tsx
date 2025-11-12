// src/app/home/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db, schema } from "@/db";
import { and, lte, gte } from "drizzle-orm";
import { formatDistanceToNowStrict, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import MySubmission from "@/components/my-submission/my-submission";

async function getActiveChallenge() {
  const now = new Date();
  const rows = await db
    .select()
    .from(schema.challenge)
    .where(
      and(
        lte(schema.challenge.startDate, now),
        gte(schema.challenge.endDate, now)
      )
    )
    .limit(1);

  return rows[0] ?? null;
}

export default async function HomeDashboard() {
  // server-side: fetch session and active challenge
  const session = await auth.api.getSession({ headers: await headers() });
  const active = await getActiveChallenge();

  const isAdmin = session?.user?.role === "admin";
  const isAuthed = !!session?.user;

  return (
    <div className="min-h-[60vh] flex items-start justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Hero / Active challenge card */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">
            Community Photo Challenges
          </h1>
          <p className="text-gray-600 mb-6">
            Weekly themed challenges — upload one photo, vote for your
            favorites, and climb the leaderboard.
          </p>
        </div>

        <Card className="bg-white">
          <CardHeader className="px-6 py-5">
            <h2 className="text-2xl font-semibold text-gray-900">
              {active ? active.title : "No active challenge right now"}
            </h2>
            {active?.description && (
              <p className="text-gray-600 mt-2">{active.description}</p>
            )}
          </CardHeader>

          <CardContent className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              {active ? (
                <>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Start:</span>{" "}
                    {format(new Date(active.startDate), "PPP p")}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">End:</span>{" "}
                    {format(new Date(active.endDate), "PPP p")}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {`Ends ${formatDistanceToNowStrict(
                      new Date(active.endDate),
                      { addSuffix: true }
                    )}`}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  There is currently no active challenge.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Admin: go to admin panel and edit if active */}
              {isAdmin && (
                <>
                  <Link href="/admin" className="block">
                    <Button className="bg-gray-900 text-white hover:bg-black">
                      Admin Panel
                    </Button>
                  </Link>
                  {active && (
                    <Link href={`/admin/challenges/${active.id}/edit`}>
                      <Button variant="outline">Edit Challenge</Button>
                    </Link>
                  )}
                </>
              )}

              {/* Authenticated user: upload / vote */}
              {isAuthed && !isAdmin && active && (
                <>
                  <Link href={`/challenges/${active.id}/upload`}>
                    <Button className="bg-gray-800 text-white hover:bg-black cursor-pointer">
                      Upload Photo
                    </Button>
                  </Link>
                  <Link href={`/challenges/${active.id}`}>
                    <Button variant="outline">View & Vote</Button>
                  </Link>
                </>
              )}

              {/* Guest: get started / learn more */}
              {!isAuthed && (
                <>
                  <Link href="/login">
                    <Button className="bg-gray-900 text-white hover:bg-black">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/#learn-more">
                    <Button variant="outline">Learn more</Button>
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* My Submission section (for logged-in users) */}
        {isAuthed && !isAdmin && active && (
          <MySubmission challengeId={active.id} />
        )}

        {/* Optional note or quick links */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            Tip: Only one submission per user per challenge. Admins can manage
            challenges in the Admin Panel.
          </p>
        </div>
      </div>
    </div>
  );
}
