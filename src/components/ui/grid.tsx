import type { ReactNode } from "react";
import { Stagger } from "@/components/motion/reveal";

const gridClassNames = {
  countdown: "countdown-grid",
  stats: "stats-grid",
  people: "people-grid",
  list: "list-grid",
  feature: "feature-grid",
  "feature-4": "feature-grid feature-grid-4",
} as const;

export type GridVariant = keyof typeof gridClassNames;

export function gridClassName(variant: GridVariant) {
  return gridClassNames[variant];
}

/** With `stagger`, wrap each child in StaggerItem. */
export function Grid({
  variant,
  as: Element = "div",
  stagger = false,
  ariaLabel,
  children,
}: {
  variant: GridVariant;
  as?: "div" | "section" | "ul";
  stagger?: boolean;
  ariaLabel?: string;
  children: ReactNode;
}) {
  if (stagger) {
    return (
      <Stagger className={gridClassName(variant)} ariaLabel={ariaLabel}>
        {children}
      </Stagger>
    );
  }
  return (
    <Element className={gridClassName(variant)} aria-label={ariaLabel}>
      {children}
    </Element>
  );
}
