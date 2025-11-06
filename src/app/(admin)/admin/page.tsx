import { db, schema } from "@/db";
import { eq, and, lte, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

// Fetch the current active challenge
async function getActiveChallenge() {
  const now = new Date();
  const active = await db
    .select()
    .from(schema.challenge)
    .where(
      and(
        lte(schema.challenge.startDate, now),
        gte(schema.challenge.endDate, now)
      )
    )
    .limit(1);

  return active[0];
}

export default async function AdminDashboardPage() {
  const activeChallenge = await getActiveChallenge();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/challenges">All Challenges</Link>
          </Button>
          <Button asChild className="bg-gray-900 text-white hover:bg-black">
            <Link href="/admin/challenges/new">+ New Challenge</Link>
          </Button>
        </div>
      </div>

      {/* Active Challenge Section */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Current Active Challenge
          </CardTitle>
        </CardHeader>

        <CardContent>
          {activeChallenge ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeChallenge.title}
                </h2>
                {activeChallenge.description && (
                  <p className="text-gray-600 mt-1">
                    {activeChallenge.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-700 text-sm">
                <p>
                  <strong>Start:</strong>{" "}
                  {format(activeChallenge.startDate, "PPP p")}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {format(activeChallenge.endDate, "PPP p")}
                </p>
              </div>

              <div className="pt-4">
                <Button asChild>
                  <Link href={`/admin/challenges/${activeChallenge.id}/edit`}>
                    Edit Challenge
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-10">
              <p className="text-lg font-medium">
                No active challenge right now
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You can create a new one anytime.
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  className="bg-gray-900 text-white hover:bg-black"
                >
                  <Link href="/admin/challenges/new">Create Challenge</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
