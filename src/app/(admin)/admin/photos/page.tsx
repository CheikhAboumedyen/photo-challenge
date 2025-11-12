// src\app\(admin)\admin\photos\page.tsx
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  getAllPhotosGroupedByChallenge,
  toggleHide,
  deletePhoto,
} from "./actions";
import { formatDistanceToNow } from "date-fns";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

export default async function AdminPhotosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.role !== "admin") redirect("/");

  const groups = await getAllPhotosGroupedByChallenge();

  if (!groups.length)
    return (
      <div className="min-h-screen px-6 py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Photo Moderation</h1>
          <p className="text-sm text-gray-600">No submissions yet.</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen px-6 py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Photo Moderation</h1>

        {groups.map((g) => (
          <section key={g.challengeId} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium">{g.challengeTitle}</h2>
                <p className="text-sm text-gray-500">
                  {g.photos.length} submission{g.photos.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {g.photos.map((p: any) => (
                <Card
                  key={p.id}
                  className="rounded-2xl overflow-hidden shadow-sm"
                >
                  <div className="relative w-full h-56">
                    <Image
                      src={p.imageUrl}
                      alt={p.caption ?? "Photo"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardContent className="p-4 flex flex-col justify-between">
                    <div>
                      <p className="font-medium text-gray-800">
                        {p.userName || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploaded{" "}
                        {formatDistanceToNow(new Date(p.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      {p.caption && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {p.caption}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="text-sm text-gray-600">
                        {p.voteCount} votes
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Hide/Unhide */}
                        <form action={toggleHide}>
                          <input type="hidden" name="photoId" value={p.id} />
                          <Button
                            size="sm"
                            variant={p.isHidden ? "secondary" : "default"}
                          >
                            {p.isHidden ? "Unhide" : "Hide"}
                          </Button>
                        </form>

                        {/* Delete with confirmation */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the photo and all
                                associated votes. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form action={deletePhoto}>
                                <input
                                  type="hidden"
                                  name="photoId"
                                  value={p.id}
                                />
                                <AlertDialogAction asChild>
                                  <Button
                                    type="submit"
                                    size="sm"
                                    variant="destructive"
                                  >
                                    Confirm Delete
                                  </Button>
                                </AlertDialogAction>
                              </form>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
