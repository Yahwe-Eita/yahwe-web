"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useLogin } from "@/hooks/useLogin";
import { getErrorMessage } from "@/lib/error-message";

export function LoginForm() {
  const router = useRouter();
  const login = useLogin();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.reset();
    const form = new FormData(event.currentTarget);

    try {
      await login.mutateAsync({
        email: String(form.get("email") ?? ""),
        password: String(form.get("password") ?? ""),
      });
      router.replace("/dashboard");
      router.refresh();
    } catch {}
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" placeholder="Enter your email" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
        />
      </label>
      <div className="form-row form-row-end">
        <Link className="text-link" href="/reset-password">
          Forgot password?
        </Link>
      </div>
      <FormMessage message={login.error ? getErrorMessage(login.error, "Wrong email or password.") : undefined} />
      <SubmitButton pending={login.isPending} pendingLabel="Login">
        Login
      </SubmitButton>
    </form>
  );
}
