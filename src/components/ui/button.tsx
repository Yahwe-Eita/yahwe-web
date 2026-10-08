import type { ComponentProps } from "react";
import { buttonClassName, type ButtonVariant } from "@/components/ui/button-variants";

export interface ButtonProps extends ComponentProps<"button"> {
  variant: ButtonVariant;
}

export function Button({ variant, className, type = "button", ...props }: ButtonProps) {
  return <button className={buttonClassName(variant, className)} type={type} {...props} />;
}
