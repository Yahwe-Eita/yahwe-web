import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

export const metadata: Metadata = { title: "Enter reset code" };

export default async function ResetPasswordVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ pinId?: string }>;
}) {
  const { pinId } = await searchParams;
  if (!pinId) redirect("/reset-password");

  return (
    <AuthShell
      backHref="/reset-password"
      title="Enter reset code"
      description="We sent a 6-digit code to the phone number linked to your account."
    >
      <ChangePasswordForm pinId={pinId} />
    </AuthShell>
  );
}
