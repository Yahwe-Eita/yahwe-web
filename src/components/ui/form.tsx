import type { ComponentProps } from "react";
import { cx } from "@/components/ui/class-names";

export function Form({ className, ...props }: ComponentProps<"form">) {
  return <form className={cx("form-stack", className)} {...props} />;
}
