import Link from "next/link";
import { getChallenges, deleteChallenge } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import { Calendar, Plus, Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

function getStatus(startDate: Date, endDate: Date) {
  const now = new Date();
  if (startDate <= now && now <= endDate) return "Active";
  if (startDate > now) return "Upcoming";
  return "Closed";
}

export default async function AdminChallengesPage() {
  const challenges = await getChallenges();

  return (
    <div className="space-y-10">
      <section className="rounded-4xl border border-nav-border/50 bg-panel/80 p-8 shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge
              variant="secondary"
              className="w-fit rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
            >
              Admin panel
            </Badge>
            <div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                Challenges
              </h1>
              <p className="text-sm text-white/70 sm:text-base">
                Launch new portrait briefs, review timelines, and maintain a
                healthy cadence for the community.
              </p>
            </div>
          </div>
          <Link href="/admin/challenges/new" className="w-full sm:w-auto">
            <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary hover:opacity-90">
              <Plus className="h-4 w-4" />
              New Challenge
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        {challenges.length === 0 ? (
          <div className="rounded-[28px] border border-nav-border/50 bg-panel/80 p-10 text-center text-white/70 shadow-[0_20px_45px_rgba(2,6,23,0.6)]">
            <Sparkles className="mx-auto mb-4 h-6 w-6 text-brand-accent" />
            <p>
              No challenges yet. Click “New Challenge” to schedule your first
              brief.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {challenges.map((ch) => {
              const status = getStatus(
                new Date(ch.startDate),
                new Date(ch.endDate)
              );
              const statusVariant =
                status === "Active"
                  ? "default"
                  : status === "Upcoming"
                  ? "secondary"
                  : "outline";

              return (
                <Card
                  key={ch.id}
                  className="flex flex-col gap-6 border border-white/10 bg-panel/80 p-6 text-brand-foreground shadow-[0_20px_45px_rgba(2,6,23,0.55)] lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-3">
                    <CardHeader className="p-0">
                      <h2 className="text-2xl font-semibold text-white">
                        {ch.title}
                      </h2>
                      <p className="text-sm text-white/70">
                        {ch.description || "No description provided."}
                      </p>
                    </CardHeader>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-brand-accent" />
                        <span>
                          {format(new Date(ch.startDate), "MMM dd, yyyy")} –{" "}
                          {format(new Date(ch.endDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <Badge
                        variant={statusVariant}
                        className={`rounded-full border border-white/20 ${
                          status === "Closed"
                            ? "bg-white/10 text-white/70"
                            : "bg-brand-gradient text-brand-on-primary"
                        }`}
                      >
                        {status}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="flex flex-col gap-3 p-0 text-sm text-white lg:flex-row lg:items-center lg:gap-6">
                    <Link
                      href={`/admin/challenges/${ch.id}/edit`}
                      className="text-center font-semibold text-white transition hover:text-brand-accent"
                    >
                      Edit
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteChallenge(ch.id);
                        revalidatePath("/admin/challenges");
                      }}
                    >
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete challenge?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the challenge and its schedule
                              for everyone. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                type="submit"
                                variant="destructive"
                                className="bg-red-500 text-white hover:bg-red-400"
                              >
                                Confirm delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </form>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
