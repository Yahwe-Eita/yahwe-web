import type { ComponentProps } from "react";
import { buttonClassName, type ButtonVariant } from "@/components/ui/button-variants";
import { externalLinkProps } from "@/components/ui/external-link";

export interface ButtonAnchorProps extends Omit<ComponentProps<"a">, "target" | "rel"> {
  variant: ButtonVariant;
  external?: boolean;
}

export function ButtonAnchor({ variant, external = false, className, ...props }: ButtonAnchorProps) {
  return <a className={buttonClassName(variant, className)} {...(external ? externalLinkProps : {})} {...props} />;
}
