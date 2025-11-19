// src/app/page.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  CalendarRange,
  Crown,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { value: "8.4K", label: "Active member" },
  { value: "162K", label: "Photos critiqued" },
  { value: "82", label: "Challenges" },
];

const highlights = [
  {
    title: "Curated prompts",
    description:
      "Weekly portrait briefs from editorial judges keep ideas fresh.",
    icon: Sparkles,
  },
  {
    title: "Story-first uploads",
    description: "Attach lighting setups, lenses, and behind-the-scenes notes.",
    icon: Camera,
  },
  {
    title: "Community learning",
    description: "Blind voting plus feedback rounds grow every participant.",
    icon: Users,
  },
];

const timeline = [
  {
    title: "Submit",
    range: "Mon – Thu",
    copy: "Drop one portrait per challenge—quality over quantity.",
  },
  {
    title: "Vote",
    range: "Fri – Sat",
    copy: "Blind voting keeps things fair and surfaces hidden gems.",
  },
  {
    title: "Celebrate",
    range: "Sun",
    copy: "Winners, critiques, and livestream breakdowns with the judges.",
  },
];

export default function Home() {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-y-0 left-1/2 h-full w-160 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[140px]" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6 lg:gap-20 lg:px-8 lg:pt-24">
        <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <div className="space-y-8">
            <Badge
              variant="secondary"
              className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/90 backdrop-blur"
            >
              New briefs drop every Monday
            </Badge>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              Portrait challenges for artists who want to grow together.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-slate-300"
            >
              Upload one photo, receive blind feedback, and climb a transparent
              leaderboard built for photographers—not influencers.
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full bg-indigo-500 px-7 text-base font-medium hover:bg-indigo-600"
                asChild
              >
                <Link href="/signup">
                  Join the next drop
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full border-white/20 bg-white/10 text-white hover:bg-white/20"
                asChild
              >
                <Link href="/leaderboard">See the leaderboard</Link>
              </Button>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label}>
                  <p className="text-3xl font-semibold text-white">
                    {item.value}
                  </p>
                  <p className="text-sm uppercase tracking-wide text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative isolate overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"
          >
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-300">
                  Next drop
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Neon Portrait Storytelling
                </h2>
                <p className="text-sm text-slate-300">
                  Submit between Mon 09:00 and Thu 23:00 UTC
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="flex items-center justify-between text-sm text-slate-200">
                  <span>Prize</span>
                  <span>$500 gear grant</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-200">
                  <span>Guest judge</span>
                  <span>Harper Lin</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="flex items-center gap-3 text-slate-200">
                  <CalendarRange className="h-5 w-5 text-indigo-300" />
                  Voting: Fri – Sat
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <ShieldCheck className="h-5 w-5 text-indigo-300" />
                  Blind review to remove bias
                </div>
                <div className="flex items-center gap-3 text-slate-200">
                  <Crown className="h-5 w-5 text-indigo-300" />
                  Sunday livestream results
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section aria-labelledby="highlights" className="space-y-6">
          <div>
            <h2 id="highlights" className="text-2xl font-semibold text-white">
              Why creators stick around
            </h2>
            <p className="text-slate-400">
              Thoughtful prompts, transparent judging, and tooling for serious
              portrait makers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((highlight) => (
              <Card
                key={highlight.title}
                className="border-white/10 bg-white/5 text-white"
              >
                <CardContent className="space-y-4 p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <highlight.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{highlight.title}</h3>
                    <p className="text-sm text-slate-300">
                      {highlight.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="timeline" className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 id="timeline" className="text-2xl font-semibold text-white">
              Weekly rhythm
            </h2>
            <p className="text-slate-400">
              Everyone shares the same cadence—submit, vote, learn, repeat.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="grid gap-6 md:grid-cols-3">
              {timeline.map((step) => (
                <div key={step.title} className="space-y-2">
                  <p className="text-sm font-medium text-indigo-200">
                    {step.range}
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-300">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500 p-10 text-center shadow-2xl">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <h3 className="text-3xl font-semibold text-white">
              Ready to host a community challenge?
            </h3>
            <p className="text-white/90">
              Spin up a moderated challenge in minutes. Enable uploads, voting
              windows, and Cloudinary-powered reviews out of the box.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full bg-white text-indigo-600"
                asChild
              >
                <Link href="/signup">Create an account</Link>
              </Button>
              <Button
                size="lg"
                className="rounded-full border-white/40 bg-transparent text-white hover:bg-white/20"
                asChild
              >
                <Link href="/docs">Browse documentation</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
