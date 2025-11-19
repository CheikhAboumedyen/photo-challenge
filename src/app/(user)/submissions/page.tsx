import Image from "next/image";
import { format } from "date-fns";
import { getPastChallengeSubmissions } from "./actions";
import { Badge } from "@/components/ui/badge";

export default async function SubmissionsPage() {
  const challengeGroups = await getPastChallengeSubmissions();

  return (
    <div className="space-y-10">
      <section className="rounded-4xl border border-nav-border/50 bg-panel/85 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
        <Badge
          variant="secondary"
          className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
        >
          Archive
        </Badge>
        <div className="mt-4 space-y-3">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Past submissions
          </h1>
          <p className="text-sm text-white/70 sm:text-base">
            Browse previous challenges and study how members interpreted each
            brief.
          </p>
        </div>
      </section>

      {challengeGroups.length === 0 ? (
        <div className="rounded-4xl border border-nav-border/40 bg-panel/80 p-10 text-center text-white/70 shadow-[0_20px_45px_rgba(2,6,23,0.6)]">
          No past submissions yet. Once challenges conclude, their galleries
          will appear here.
        </div>
      ) : (
        challengeGroups.map((group) => (
          <section
            key={group.challenge.id}
            className="space-y-4 rounded-4xl border border-nav-border/40 bg-panel/80 p-6 shadow-[0_20px_45px_rgba(2,6,23,0.6)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  Challenge
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {group.challenge.title}
                </h2>
                <p className="text-sm text-white/70">
                  {format(new Date(group.challenge.startDate), "MMM dd, yyyy")}{" "}
                  – {format(new Date(group.challenge.endDate), "MMM dd, yyyy")}
                </p>
                {group.challenge.description && (
                  <p className="mt-2 text-sm text-white/70">
                    {group.challenge.description}
                  </p>
                )}
              </div>
              <Badge className="w-fit rounded-full border border-white/20 bg-transparent text-xs text-white/70">
                {group.photos.length} submission
                {group.photos.length > 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.photos.map((photo) => (
                <article
                  key={photo.id}
                  className="flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-black/20 text-white shadow-[0_20px_45px_rgba(2,6,23,0.65)]"
                >
                  <div className="relative h-60 w-full">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption || "Submission"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5 text-sm">
                    <div>
                      <p className="text-base font-semibold">
                        {photo.userName}
                      </p>
                      <p className="text-xs text-white/60">
                        Uploaded{" "}
                        {format(new Date(photo.createdAt), "MMM dd, yyyy")}
                      </p>
                      {photo.caption && (
                        <p className="mt-2 text-white/70 line-clamp-2">
                          {photo.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
