import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { PhoneForm } from "@/components/auth/phone-form";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Your MoMo number" };

export default async function RegisterPhonePage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (registration.feeReference) redirect("/register/payment");

  return (
    <AuthShell
      backHref="/sponsor/confirmation"
      title="Your MoMo number"
      description="Your account and rewards will use this MTN Mobile Money number. A code will be sent to confirm it is yours."
    >
      <RegistrationProgress step="Phone" />
      <PhoneForm />
    </AuthShell>
  );
}
