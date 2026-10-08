import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { ButtonLink } from "@/components/ui/button-link";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Sponsor verified successfully" };

export default async function SponsorConfirmationPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (registration.feeReference) redirect("/register/payment");

  return (
    <AuthShell backHref="/sponsor" title="Sponsor verified successfully">
      <RegistrationProgress step="Sponsor" />
      <div className="confirmation-panel">
        <span className="confirmation-check" aria-hidden="true">
          ✓
        </span>
        <strong>{registration.sponsorName}</strong>
        <span>+{registration.sponsorPhone}</span>
      </div>
      <p className="confirmation-description">This person will be your sponsor in the Yahwe-Eita network.</p>
      <ButtonLink variant="submit" href="/register/phone">
        Continue
      </ButtonLink>
    </AuthShell>
  );
}
