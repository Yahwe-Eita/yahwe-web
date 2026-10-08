import type { ReactNode } from "react";
import { cx } from "@/components/ui/class-names";

export function CountdownCard({ dark = false, children }: { dark?: boolean; children: ReactNode }) {
  return <article className={cx("countdown-card", dark && "countdown-card-dark")}>{children}</article>;
}
