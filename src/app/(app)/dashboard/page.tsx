import type { Metadata } from "next";
import { DashboardView } from "@/components/app/dashboard-view";
import { getProgramme } from "@/lib/server/programme";

export const metadata: Metadata = { title: "Home" };

export default async function DashboardPage() {
  const programme = await getProgramme();
  return <DashboardView depthLimit={programme.depthLimit} />;
}
