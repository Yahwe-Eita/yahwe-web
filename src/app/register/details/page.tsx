import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationForm } from "@/components/auth/registration-form";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { getProgramme } from "@/lib/server/programme";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Create account" };
export const dynamic = "force-dynamic";

function latestBirthDate(minimumAge: number) {
  const today = new Date();
  today.setUTCFullYear(today.getUTCFullYear() - minimumAge);
  return today.toISOString().slice(0, 10);
}

export default async function RegisterDetailsPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (registration.feeReference) redirect("/register/payment");
  if (!registration.verifiedName || !registration.verifiedPhone) redirect("/register/phone");
  const programme = await getProgramme();

  return (
    <AuthShell backHref="/register/phone" title="Create account" wide>
      <RegistrationProgress step="Details" />
      <RegistrationForm
        fullName={registration.verifiedName}
        phone={registration.verifiedPhone}
        feeAmount={programme.feeAmount}
        latestBirthDate={latestBirthDate(programme.minimumAge)}
      />
    </AuthShell>
  );
}
