import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { RegistrationForm } from "@/components/auth/registration-form";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Register" };

export default async function RegisterDetailsPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (!registration.verifiedName || !registration.verifiedPhone) redirect("/register/phone");

  return (
    <AuthShell backHref="/register/phone" title="Create Account" wide>
      <RegistrationProgress currentStep={4} />
      <RegistrationForm
        fullName={registration.verifiedName}
        phone={registration.verifiedPhone}
      />
    </AuthShell>
  );
}
