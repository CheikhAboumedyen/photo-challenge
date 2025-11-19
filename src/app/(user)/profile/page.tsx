// src/app/(user)/profile/page.tsx
import { getProfile } from "./actions";
import ProfileForm from "@/components/forms/profile-form";
import { Badge } from "@/components/ui/badge";
import { Camera, ShieldCheck, Sparkles } from "lucide-react";

export default async function ProfilePage() {
  const user = await getProfile();

  const highlights = [
    {
      title: "Identity locked in",
      description: `Current role: ${user.role ?? "member"}.`,
      icon: ShieldCheck,
    },
    {
      title: "Portfolio ready",
      description: "Uploads stay tied to this profile across every challenge.",
      icon: Camera,
    },
    {
      title: "Community first",
      description: "Share lighting notes and feedback to level up together.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-10">
      <section className="rounded-4xl border border-nav-border/50 bg-panel/80 p-8 text-brand-foreground shadow-[0_25px_60px_rgba(2,6,23,0.65)]">
        <Badge
          variant="secondary"
          className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-white/80"
        >
          Creator profile
        </Badge>
        <div className="mt-4 space-y-3">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            Personal settings
          </h1>
          <p className="text-sm text-white/70 sm:text-base">
            Keep your avatar, name, and account details polished so fellow
            photographers know who they’re learning from.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/80"
            >
              <div className="mb-3 flex items-center gap-2 text-white">
                <item.icon className="h-4 w-4 text-brand-accent" />
                <p className="font-semibold">{item.title}</p>
              </div>
              <p className="text-white/70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex justify-center">
        <ProfileForm user={user} />
      </section>
    </div>
  );
}
