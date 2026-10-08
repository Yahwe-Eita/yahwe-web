import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { SponsorForm } from "@/components/auth/sponsor-form";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Verify your sponsor" };

export default async function SponsorPage() {
  const registration = await getRegistration();
  if (registration?.feeReference) redirect("/register/payment");

  return (
    <AuthShell
      backHref="/onboarding"
      title="Verify your sponsor"
      description="Enter your sponsor's phone number without the leading 0."
    >
      <RegistrationProgress step="Sponsor" />
      <SponsorForm />
    </AuthShell>
  );
}
