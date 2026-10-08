import type { ReactNode } from "react";

export type StatusTone = "active" | "inactive" | "pending" | "processing" | "completed" | "failed";

export function statusPillClassName(tone: StatusTone) {
  return `status-pill status-${tone}`;
}

export function StatusPill({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return <span className={statusPillClassName(tone)}>{children}</span>;
}
