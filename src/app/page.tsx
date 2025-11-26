// src/app/page.tsx
import HomeLanding from "@/components/landing/home-landing";
import { getSiteStats } from "@/lib/stats";

export default async function Home() {
  const stats = await getSiteStats();
  const numberFormatter = new Intl.NumberFormat("en-US");
  const statItems = [
    {
      value: numberFormatter.format(stats.totalMembers),
      label: "Active members",
    },
    {
      value: numberFormatter.format(stats.totalPhotos),
      label: "Photos uploaded",
    },
    { value: numberFormatter.format(stats.totalVotes), label: "Votes cast" },
  ];

  return <HomeLanding statItems={statItems} />;
}
