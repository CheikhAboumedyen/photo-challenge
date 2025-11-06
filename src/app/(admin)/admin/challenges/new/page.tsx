"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createChallenge } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "sonner"; // optional: nice feedback toasts

export default function NewChallengePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    startTransition(async () => {
      try {
        await createChallenge(formData);
        toast.success("Challenge created successfully!");
        router.push("/admin/challenges");
      } catch (err) {
        console.error(err);
        toast.error("Failed to create challenge.");
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            New Challenge
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter challenge title"
                className="bg-gray-50 border-gray-300"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the challenge"
                className="bg-gray-50 border-gray-300"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-gray-700">
                  Start Date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-gray-700">
                  End Date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="bg-gray-50 border-gray-300"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/challenges")}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gray-900 text-white hover:bg-black"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Challenge"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
