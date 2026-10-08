import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/server/session";

export const metadata: Metadata = { title: "Login" };

const notices: Record<string, string> = {
  passwordUpdated: "Password updated. Sign in with your new password.",
  sessionEnded: "Your session has ended. Please log in again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordUpdated?: string; session?: string }>;
}) {
  if (await getSession()) redirect("/dashboard");
  const params = await searchParams;
  const notice =
    params.passwordUpdated === "true"
      ? notices.passwordUpdated
      : params.session === "ended"
        ? notices.sessionEnded
        : undefined;

  return (
    <AuthShell backHref="/" title="Welcome back">
      <LoginForm notice={notice} />
    </AuthShell>
  );
}
