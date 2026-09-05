import type { Metadata } from "next";
import { DashboardView } from "@/components/app/dashboard-view";

export const metadata: Metadata = { title: "Home" };

export default function DashboardPage() {
  return <DashboardView />;
}
