import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { and, lte, gte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarRange, Sparkles } from "lucide-react";

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
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "admin") {
    redirect("/home");
  }

  const activeChallenge = await getActiveChallenge();

  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-nav-border/50 bg-panel/85 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge
              variant="secondary"
              className="w-fit rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
            >
              Admin dashboard
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Current brief overview
              </h1>
              <p className="text-sm text-white/70 sm:text-base">
                Monitor the live challenge, edit timelines, or spin up a new
                drop.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              variant="secondary"
              className="h-12 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              <Link href="/admin/challenges">All challenges</Link>
            </Button>
            <Button
              asChild
              className="h-12 rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary hover:opacity-90"
            >
              <Link href="/admin/challenges/new">New challenge</Link>
            </Button>
          </div>
        </div>
      </section>

      <Card className="rounded-4xl border border-white/10 bg-panel/80 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.65)]">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Sparkles className="h-5 w-5 text-brand-accent" />
            Active challenge
          </CardTitle>
          <p className="text-sm text-white/70">
            Only one challenge can run at a time. Keep dates tight so creators
            stay engaged.
          </p>
        </CardHeader>
        <CardContent>
          {activeChallenge ? (
            <div className="space-y-6 text-white">
              <div>
                <h2 className="text-2xl font-semibold">
                  {activeChallenge.title}
                </h2>
                {activeChallenge.description && (
                  <p className="mt-2 text-sm text-white/70">
                    {activeChallenge.description}
                  </p>
                )}
              </div>

              <div className="grid gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/80 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-white/60">
                    <CalendarRange className="h-4 w-4 text-brand-accent" />
                    Start
                  </p>
                  <p className="font-medium">
                    {format(activeChallenge.startDate, "PPP p")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-white/60">
                    <CalendarRange className="h-4 w-4 text-brand-accent" />
                    End
                  </p>
                  <p className="font-medium">
                    {format(activeChallenge.endDate, "PPP p")}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  asChild
                  className="h-12 rounded-full bg-brand-gradient text-brand-on-primary text-base font-semibold hover:opacity-90"
                >
                  <Link href={`/admin/challenges/${activeChallenge.id}/edit`}>
                    Edit challenge
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 p-10 text-center text-white/70">
              <p className="text-lg font-semibold text-white">
                No active challenge
              </p>
              <p className="mt-2 text-sm text-white/60">
                Schedule the next portrait brief to keep the momentum going.
              </p>
              <Button
                asChild
                className="mt-6 h-12 rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary hover:opacity-90"
              >
                <Link href="/admin/challenges/new">Create challenge</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
