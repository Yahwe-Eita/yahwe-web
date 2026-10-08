import type { ComponentProps } from "react";
import { cx } from "@/components/ui/class-names";

export function Stack({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("form-stack", className)} {...props} />;
}
