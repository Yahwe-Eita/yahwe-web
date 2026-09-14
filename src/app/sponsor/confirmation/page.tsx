import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Sponsor Verified Successfully" };

export default async function SponsorConfirmationPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");

  return (
    <AuthShell backHref="/sponsor" title="Sponsor Verified Successfully">
      <RegistrationProgress currentStep={1} />
      <div className="bg-white border border-gray-300 rounded-md p-4 text-black flex items-center flex-col w-full justify-center">
        <span className="confirmation-check" aria-hidden="true">
          ✓
        </span>
        <strong>{registration.sponsorName}</strong>
        <span>{registration.sponsorPhone}</span>
      </div>
      <p className="my-6 text-white text-center w-full">
        This person will be your sponsor in the YAHWE-EITA network.
      </p>
      <Link className="submit-button" href="/register/phone">
        CONTINUE
      </Link>
    </AuthShell>
  );
}
