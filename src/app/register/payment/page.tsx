import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { PaymentStatus } from "@/components/auth/payment-status";
import { RegistrationProgress } from "@/components/auth/registration-progress";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Payment" };

export default async function PaymentPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (!registration.pending || !registration.feeReference) redirect("/register/details");

  return (
    <AuthShell title="Payment">
      <RegistrationProgress step="Payment" />
      <PaymentStatus />
    </AuthShell>
  );
}
