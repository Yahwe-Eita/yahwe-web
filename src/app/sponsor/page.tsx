import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { SponsorForm } from "@/components/auth/sponsor-form";

export const metadata: Metadata = { title: "Verify Your Sponsor" };

export default function SponsorPage() {
  return (
    <AuthShell
      backHref="/onboarding"
      title="Verify Your Sponsor"
      description="Enter your sponsor's phone number without the leading 0"
    >
      <RegistrationProgress currentStep={1} />
      <SponsorForm />
    </AuthShell>
  );
}
