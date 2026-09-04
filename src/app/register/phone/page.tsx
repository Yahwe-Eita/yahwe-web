import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { PhoneForm } from "@/components/auth/phone-form";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Verify Mobile Money" };

export default async function RegisterPhonePage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");

  return (
    <AuthShell
      backHref="/sponsor"
      eyebrow="Account setup"
      title="Verify your MTN MoMo number"
      description="Enter the number without the international country code."
    >
      <PhoneForm />
    </AuthShell>
  );
}
