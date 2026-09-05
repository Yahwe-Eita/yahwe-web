import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Welcome Back" };

export default function LoginPage() {
  return (
    <AuthShell
      backHref="/"
      eyebrow="Member access"
      title="Welcome back"
      description="Log in to continue to your account."
    >
      <LoginForm />
    </AuthShell>
  );
}
