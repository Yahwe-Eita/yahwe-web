import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { SponsorForm } from "@/components/auth/sponsor-form";

export const metadata: Metadata = { title: "Verify sponsor" };

export default function SponsorPage() {
  return (
    <AuthShell
      backHref="/onboarding"
      eyebrow="Account setup"
      title="Verify your sponsor"
      description="Enter your sponsor's phone number to confirm their account."
    >
      <SponsorForm />
    </AuthShell>
  );
}
