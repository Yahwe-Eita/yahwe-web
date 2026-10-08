import type { Metadata } from "next";
import { DashboardView } from "@/components/app/dashboard-view";
import { getProgramme } from "@/lib/server/programme";

export const metadata: Metadata = { title: "Home" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const programme = await getProgramme();
  return (
    <DashboardView
      depthLimit={programme.depthLimit}
      recruitWindowDays={programme.recruitWindowDays}
      cycleDays={programme.cycleDays}
    />
  );
}
