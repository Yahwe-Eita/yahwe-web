import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { PaymentStatus } from "@/components/auth/payment-status";
import { getRegistration } from "@/lib/server/registration";

export const metadata: Metadata = { title: "Payment status" };

export default async function PaymentPage() {
  const registration = await getRegistration();
  if (!registration) redirect("/sponsor");
  if (!registration.pending || !registration.feeReference) {
    redirect("/register/details");
  }
  return (
    <AuthShell
      eyebrow="Mobile Money"
      title="Approve your payment"
      description="Your account will be created as soon as the GHS 150 airtime purchase is confirmed."
    >
      <PaymentStatus reference={registration.feeReference} />
    </AuthShell>
  );
}
