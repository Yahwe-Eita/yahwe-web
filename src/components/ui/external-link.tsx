import type { ComponentProps } from "react";
import { cx } from "@/components/ui/class-names";

export const externalLinkProps = { target: "_blank", rel: "noreferrer" } as const;

export interface ExternalLinkProps extends Omit<ComponentProps<"a">, "target" | "rel"> {
  arrow?: boolean;
}

export function ExternalLink({ arrow = false, className, children, ...props }: ExternalLinkProps) {
  return (
    <a className={cx(arrow && "external-link", className) || undefined} {...externalLinkProps} {...props}>
      {children}
      {arrow ? <span aria-hidden="true">↗</span> : null}
    </a>
  );
}
