import type { ComponentProps } from "react";
import { cx } from "@/components/ui/class-names";

export function AuthTitle({ className, ...props }: ComponentProps<"h1">) {
  return <h1 className={cx("auth-title", className)} {...props} />;
}
