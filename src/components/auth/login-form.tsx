"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { TextLink } from "@/components/ui/text-link";
import { useLogin } from "@/hooks/useLogin";
import { getErrorMessage } from "@/lib/error-message";

export function LoginForm({ notice }: { notice?: string }) {
  const router = useRouter();
  const login = useLogin();

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
    <Form onSubmit={submit}>
      <FormMessage tone="info" message={login.isIdle ? notice : undefined} />
      <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="Enter your email" required />
      <PasswordField
        id="current-password"
        label="Password"
        name="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        required
      />
      <div className="form-row form-row-end">
        <TextLink href="/reset-password">
          Forgot password?
        </TextLink>
      </div>
      <FormMessage message={login.error ? getErrorMessage(login.error, "Wrong email or password.") : undefined} />
      <SubmitButton pending={login.isPending} pendingLabel="Logging in…">
        Login
      </SubmitButton>
    </Form>
  );
}
