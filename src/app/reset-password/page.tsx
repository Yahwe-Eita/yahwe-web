import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ResetPasswordPage() {
  return (
    <AuthShell
      backHref="/login"
      title="Reset password"
      description="A code will be sent to the phone number on your account."
    >
      <ResetPasswordForm />
    </AuthShell>
  );
}
