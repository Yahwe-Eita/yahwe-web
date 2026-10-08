import type { ReactNode } from "react";
import { cx } from "@/components/ui/class-names";

export function StatCard({ label, value, accent = false }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <article className={cx("stat-card", accent && "stat-card-accent")}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
