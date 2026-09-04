import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Reveal className="empty-state">
      <span aria-hidden="true">○</span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </Reveal>
  );
}
