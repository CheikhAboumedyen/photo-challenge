// src\components\my-submission\my-submission-client.tsx
"use client";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function MySubmissionClient({
  photo,
}: {
  photo: {
    id: string;
    imageUrl: string;
    caption: string | null;
    createdAt: string;
    votes: number | null;
  };
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const res = await fetch("/api/photos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photo.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success("Photo deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border">
      <h3 className="text-sm font-medium text-gray-800 mb-3">My Submission</h3>

      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="w-full md:w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={photo.imageUrl}
            alt={photo.caption || "My submission"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-gray-700">{photo.caption || "No caption"}</p>
          <p className="text-sm text-gray-500">
            {formatDistanceToNowStrict(new Date(photo.createdAt), {
              addSuffix: true,
            })}
          </p>
          <p className="text-sm text-gray-700">
            Votes: <span className="font-semibold">{photo.votes ?? 0}</span>
          </p>

          <div className="pt-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-fit text-gray-50 bg-gray-800 hover:bg-black hover:text-white cursor-pointer"
                >
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Are you sure you want to
                    delete this photo?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
