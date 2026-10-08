"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Field } from "@/components/ui/field";

export interface PasswordFieldProps extends Omit<ComponentProps<"input">, "type" | "id"> {
  id: string;
  label: ReactNode;
}

export function PasswordField({ id, label, ...props }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Field label={label} htmlFor={id}>
      <div className="password-field">
        <input id={id} type={showPassword ? "text" : "password"} {...props} />
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
    </Field>
  );
}
