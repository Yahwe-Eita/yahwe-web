import type { ComponentProps, ReactNode } from "react";
import { Field } from "@/components/ui/field";

export const PHONE_PREFIX = "+233";
export const PHONE_HINT = "Enter 9 digits without the leading 0";

export interface PhoneFieldProps extends Omit<ComponentProps<"input">, "type" | "inputMode" | "pattern"> {
  label: ReactNode;
}

export function PhoneField({ label, ...props }: PhoneFieldProps) {
  return (
    <Field label={label} hint={PHONE_HINT}>
      <div className="phone-field">
        <span aria-hidden="true">{PHONE_PREFIX}</span>
        <input type="tel" inputMode="numeric" pattern="\d{9}" {...props} />
      </div>
    </Field>
  );
}
