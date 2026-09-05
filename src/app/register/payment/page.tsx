import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { PaymentStatus } from "@/components/auth/payment-status";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Awaiting Payment" };

export default async function PaymentPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (!registration.pending || !registration.feeReference) {
    redirect("/register/details");
  }
  return (
    <AuthShell title="">
      <PaymentStatus reference={registration.feeReference} />
    </AuthShell>
  );
}
