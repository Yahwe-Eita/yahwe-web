import type { Metadata } from "next";
import { Onboarding } from "@/components/auth/onboarding";

export const metadata: Metadata = { title: "Get started" };

export default function OnboardingPage() {
  return <Onboarding />;
}
