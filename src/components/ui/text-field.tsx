import type { ComponentProps, ReactNode } from "react";
import { Field } from "@/components/ui/field";

export interface TextFieldProps extends ComponentProps<"input"> {
  label: ReactNode;
  hint?: ReactNode;
}

export function TextField({ label, hint, ...props }: TextFieldProps) {
  return (
    <Field label={label} hint={hint}>
      <input {...props} />
    </Field>
  );
}
