import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/components/ui/class-names";

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link className={cx("text-link", className)} {...props} />;
}
