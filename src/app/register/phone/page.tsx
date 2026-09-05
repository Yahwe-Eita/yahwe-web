import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { PhoneForm } from "@/components/auth/phone-form";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Enter your MTN MoMo number" };

export default async function RegisterPhonePage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");

  return (
    <AuthShell
      backHref="/sponsor"
      title="Enter your MTN MoMo number"
      description="Enter your MTN MobileMoney number without the leading 0"
    >
      <RegistrationProgress currentStep={2} />
      <PhoneForm />
    </AuthShell>
  );
}
