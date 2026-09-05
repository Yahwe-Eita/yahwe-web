import type { Metadata } from "next";
import { Onboarding } from "@/components/auth/onboarding";

export const metadata: Metadata = { title: "WELCOME" };

export default function OnboardingPage() {
  return <Onboarding />;
}
