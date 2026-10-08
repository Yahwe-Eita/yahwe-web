import type { ComponentProps } from "react";
import { cx } from "@/components/ui/class-names";

const sectionVariantClassNames = { default: "", split: "site-split", join: "join-section" } as const;

export type SectionVariant = keyof typeof sectionVariantClassNames;

export function sectionClassName(variant: SectionVariant) {
  return cx("site-section", sectionVariantClassNames[variant]);
}

export function Section({ variant = "default", className, ...props }: ComponentProps<"section"> & { variant?: SectionVariant }) {
  return <section className={cx(sectionClassName(variant), className)} {...props} />;
}
