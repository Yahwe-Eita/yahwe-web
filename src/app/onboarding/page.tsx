import type { Metadata } from "next";
import { Onboarding } from "@/components/auth/onboarding";
import { onboardingSlides } from "@/content/onboarding";
import { getProgramme } from "@/lib/server/programme";

export const metadata: Metadata = { title: "Welcome" };
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const programme = await getProgramme();
  return <Onboarding slides={onboardingSlides(programme)} minimumAge={programme.minimumAge} />;
}
