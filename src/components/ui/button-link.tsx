import Link from "next/link";
import type { ComponentProps } from "react";
import { buttonClassName, type ButtonVariant } from "@/components/ui/button-variants";

export type ButtonLinkProps = ComponentProps<typeof Link> & { variant: ButtonVariant };

export function ButtonLink({ variant, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClassName(variant, className)} {...props} />;
}
