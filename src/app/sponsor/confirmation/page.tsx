import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Sponsor confirmed" };

export default async function SponsorConfirmationPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");

  return (
    <AuthShell
      backHref="/sponsor"
      eyebrow="Sponsor verified"
      title="You’re connected"
      description="Please confirm that this is the person who invited you."
    >
      <div className="confirmation-panel">
        <span className="confirmation-check" aria-hidden="true">
          ✓
        </span>
        <strong>{registration.sponsorName}</strong>
        <span>{registration.sponsorPhone}</span>
      </div>
      <Link className="submit-button" href="/register/phone">
        Continue
      </Link>
    </AuthShell>
  );
}
