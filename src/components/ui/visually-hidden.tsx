import type { ReactNode } from "react";

export function VisuallyHidden({
  as: Element = "span",
  id,
  children,
}: {
  as?: "span" | "h2" | "caption";
  id?: string;
  children: ReactNode;
}) {
  return (
    <Element className="sr-only" id={id}>
      {children}
    </Element>
  );
}
