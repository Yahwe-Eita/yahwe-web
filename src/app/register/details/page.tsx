import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { RegistrationForm } from "@/components/auth/registration-form";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Create account" };

export default async function RegisterDetailsPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (!registration.verifiedPhone) redirect("/register/phone");

  return (
    <AuthShell
      backHref="/register/phone"
      eyebrow="Final details"
      title="Create your account"
      description="Your identity information is used only to verify your registration."
    >
      <RegistrationForm />
    </AuthShell>
  );
}
