// src\app\(admin)\admin\challenges\page.tsx
import Link from "next/link";
import { getChallenges, deleteChallenge } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

//  Utility to compute challenge status
function getStatus(startDate: Date, endDate: Date) {
  const now = new Date();
  if (startDate <= now && now <= endDate) return "Active";
  if (startDate > now) return "Upcoming";
  return "Closed";
}

export default async function AdminChallengesPage() {
  const challenges = await getChallenges();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Challenges</h1>
        <Link href="/admin/challenges/new">
          <Button className="bg-gray-900 text-white hover:bg-black cursor-pointer">
            + New Challenge
          </Button>
        </Link>
      </div>

      {/* Content */}
      {challenges.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-gray-600">No challenges yet.</p>
          <p className="text-gray-500 text-sm">
            Click “New Challenge” to create your first one.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {challenges.map((ch) => (
            <Card
              key={ch.id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 hover:shadow-sm transition"
            >
              <CardHeader className="w-full md:w-auto p-0">
                <h2 className="font-medium text-lg text-gray-800">
                  {ch.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {ch.description || "No description"}
                </p>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 p-0 mt-3 md:mt-0">
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium text-gray-700">Start:</span>{" "}
                    {format(new Date(ch.startDate), "MMM dd, yyyy")}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">End:</span>{" "}
                    {format(new Date(ch.endDate), "MMM dd, yyyy")}
                  </p>
                </div>

                <Badge
                  variant={
                    getStatus(new Date(ch.startDate), new Date(ch.endDate)) ===
                    "Active"
                      ? "default"
                      : "secondary"
                  }
                  className={`${
                    getStatus(new Date(ch.startDate), new Date(ch.endDate)) ===
                    "Closed"
                      ? "bg-gray-300 text-gray-700"
                      : ""
                  }`}
                >
                  {getStatus(new Date(ch.startDate), new Date(ch.endDate))}
                </Badge>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/challenges/${ch.id}/edit`}
                    className="text-sm font-medium text-gray-700 hover:text-black transition"
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
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
