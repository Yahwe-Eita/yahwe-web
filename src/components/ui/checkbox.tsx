import type { ComponentProps, ReactNode } from "react";

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  children: ReactNode;
}

export function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <label className="terms-check">
      <input type="checkbox" {...props} />
      <span>{children}</span>
    </label>
  );
}
