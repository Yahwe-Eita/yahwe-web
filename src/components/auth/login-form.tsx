"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { useLogin } from "@/hooks/useLogin";
import { getErrorMessage } from "@/lib/error-message";

export function LoginForm({ notice }: { notice?: string }) {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    login.mutate(
      { email: String(form.get("email") ?? ""), password: String(form.get("password") ?? "") },
      {
        onSuccess: () => {
          router.replace("/dashboard");
          router.refresh();
        },
      },
    );
  }

  return (
    <form className="form-stack" onSubmit={submit}>
      <FormMessage tone="info" message={login.isIdle ? notice : undefined} />
      <label className="field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </label>
      <div className="field">
        <label htmlFor="current-password">Password</label>
        <div className="password-field">
          <input
            id="current-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className="form-row form-row-end">
        <Link className="text-link" href="/reset-password">
          Forgot password?
        </Link>
      </div>
      <FormMessage message={login.error ? getErrorMessage(login.error, "Wrong email or password.") : undefined} />
      <SubmitButton pending={login.isPending} pendingLabel="Logging in…">
        Log in
      </SubmitButton>
    </form>
  );
}
