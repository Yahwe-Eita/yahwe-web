import type { ReactNode } from "react";
import { cx } from "@/components/ui/class-names";

export function Band({ dark = false, children }: { dark?: boolean; children: ReactNode }) {
  return <div className={cx("site-band", dark && "site-band-dark")}>{children}</div>;
}
