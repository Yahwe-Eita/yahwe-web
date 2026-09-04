import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell
      backHref="/"
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Access your referrals, rewards, and transaction history."
    >
      <LoginForm />
      <p className="auth-footnote">
        New to Yahwe-Eita? <Link href="/onboarding">Create an account</Link>
      </p>
    </AuthShell>
  );
}
