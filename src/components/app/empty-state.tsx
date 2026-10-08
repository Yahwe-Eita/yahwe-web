import type { AriaRole, ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  icon = "○",
  role,
  headingLevel = 2,
  animate = true,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: string;
  role?: AriaRole;
  headingLevel?: 1 | 2;
  animate?: boolean;
}) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  return (
    <div className={animate ? "empty-state reveal" : "empty-state"} role={role}>
      <span aria-hidden="true">{icon}</span>
      <Heading>{title}</Heading>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  );
}
