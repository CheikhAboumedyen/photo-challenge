// src\app\(admin)\admin\challenges\new\page.tsx
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createChallenge } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";

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
    const limitedValue = name === "description" ? value.slice(0, 50) : value;
    setFormData((prev) => ({ ...prev, [name]: limitedValue }));
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
    <div className="space-y-8">
      <section className="rounded-4xl border border-nav-border/50 bg-panel/85 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.75)]">
        <Badge
          variant="secondary"
          className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
        >
          Admin tools
        </Badge>
        <div className="mt-4 space-y-3">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Launch a new challenge
          </h1>
          <p className="text-sm text-white/70 sm:text-base">
            Set the theme, description, and schedule so the community knows what
            to submit next.
          </p>
        </div>
      </section>

      <Card className="rounded-4xl border border-white/10 bg-panel/90 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.65)]">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-white">
            <Plus className="h-5 w-5 text-brand-accent" />
            New challenge
          </CardTitle>
          <p className="text-sm text-white/70">
            Titles, descriptions, and dates can be adjusted later if needed.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/80">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter challenge title"
                className="h-12 border-nav-border/50 bg-transparent text-white placeholder:text-white/50 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/80">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe the challenge"
                maxLength={50}
                className="min-h-[140px] border-nav-border/50 bg-transparent text-white placeholder:text-white/50 focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
              />
              <p className="text-xs text-white/60">
                {formData.description.length} / 50
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-white/80">
                  Start date
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="h-12 border-nav-border/50 bg-transparent text-white focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-white/80">
                  End date
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="h-12 border-nav-border/50 bg-transparent text-white focus-visible:border-brand-primary focus-visible:ring-brand-primary/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/admin/challenges")}
                disabled={isPending}
                className="h-12 rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 rounded-full bg-brand-gradient text-base font-semibold text-brand-on-primary hover:opacity-90"
              >
                {isPending ? "Creating..." : "Create challenge"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
