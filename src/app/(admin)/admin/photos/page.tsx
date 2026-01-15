// src\app\(admin)\admin\photos\page.tsx
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import {
  getAllPhotosGroupedByChallenge,
  toggleHide,
  deletePhoto,
} from "./actions";
import { formatDistanceToNow } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { EyeOff, Eye } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminPhotosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") redirect("/");

  const t = await getTranslations("AdminPhotos");
  const locale = await getLocale();
  const dateLocale = locale === "fr" ? fr : enUS;
  const groups = await getAllPhotosGroupedByChallenge();

  if (!groups.length)
    return (
      <div className="min-h-screen px-4 py-16 text-brand-foreground">
        <div className="mx-auto max-w-5xl rounded-4xl border border-nav-border/40 bg-panel/80 p-8 text-center shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <Badge
            variant="secondary"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
          >
            {t("pageBadge")}
          </Badge>
          <p className="mt-4 text-2xl font-semibold text-white">
            {t("emptyTitle")}
          </p>
          <p className="mt-2 text-sm text-white/70">{t("emptyDescription")}</p>
        </div>
      </div>
    );

  return (
    <div className="relative isolate min-h-screen px-4 py-12 text-brand-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[-8%] top-0 h-72 w-72 rounded-full bg-brand-gradient blur-[180px]" />
        <div className="absolute right-[-5%] bottom-[-10%] h-80 w-80 rounded-full bg-brand-gradient blur-[220px]" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-10">
        <section className="rounded-4xl border border-nav-border/50 bg-panel/85 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
          <Badge
            variant="secondary"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
          >
            {t("pageBadge")}
          </Badge>
          <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              {t("pageTitle")}
            </h1>
            <p className="text-sm text-white/70">{t("pageSubtitle")}</p>
          </div>
        </section>

        {groups.map((g) => (
          <section
            key={g.challengeId}
            className="space-y-4 rounded-4xl border border-nav-border/40 bg-panel/80 p-6 shadow-[0_20px_45px_rgba(2,6,23,0.6)]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/60">
                  {t("groupLabel")}
                </p>
                <h2 className="text-2xl font-semibold text-white">
                  {g.challengeTitle}
                </h2>
                <p className="text-sm text-white/70">
                  {t("photoCount", { count: g.photos.length })}
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g.photos.map((p: any) => (
                <Card
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-[28px] border border-white/10 bg-black/20 text-white shadow-[0_20px_45px_rgba(2,6,23,0.65)]"
                >
                  <div className="relative h-60 w-full">
                    <Image
                      src={p.imageUrl}
                      alt={p.caption ?? t("photoAlt")}
                      fill
                      className={`object-cover ${
                        p.isHidden ? "opacity-40 grayscale" : ""
                      }`}
                    />
                    {p.isHidden && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
                          <EyeOff className="h-4 w-4" />
                          {t("hiddenLabel")}
                        </span>
                      </div>
                    )}
                  </div>

                  <CardContent className="flex flex-1 flex-col justify-between p-5 text-sm">
                    <div className="space-y-2">
                      <p className="text-base font-semibold">
                        {p.userName || t("anonymousUser")}
                      </p>
                      <p className="text-xs text-white/60">
                        {t("uploadedLabel")}{" "}
                        {formatDistanceToNow(new Date(p.createdAt), {
                          addSuffix: true,
                          locale: dateLocale,
                        })}
                      </p>
                      {p.caption && (
                        <p className="text-sm text-white/70 line-clamp-2">
                          {p.caption}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                      <span>{t("votesLabel", { count: p.voteCount })}</span>
                      <div className="flex items-center gap-2">
                        <form action={toggleHide}>
                          <input type="hidden" name="photoId" value={p.id} />
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
                          >
                            {p.isHidden ? (
                              <>
                                <Eye className="mr-1 h-3.5 w-3.5" />
                                {t("showCta")}
                              </>
                            ) : (
                              <>
                                <EyeOff className="mr-1 h-3.5 w-3.5" />
                                {t("hideCta")}
                              </>
                            )}
                          </Button>
                        </form>
                        <ConfirmDialog
                          trigger={
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full border border-red-400/40 text-red-300 hover:bg-red-500/10"
                            >
                              {t("deleteCta")}
                            </Button>
                          }
                          title={t("deleteTitle")}
                          description={t("deleteDescription")}
                          cancelLabel={t("cancelCta")}
                          confirmLabel={t("confirmDeleteCta")}
                          formAction={deletePhoto}
                          hiddenInputs={[{ name: "photoId", value: p.id }]}
                          confirmButtonSize="sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
