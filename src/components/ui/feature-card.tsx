import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";

export function FeatureCard({
  icon,
  title,
  lead,
  children,
}: {
  icon?: IconName;
  title?: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <article className="feature-card">
      {icon ? <Icon className="feature-icon" name={icon} size={30} /> : null}
      {title ? <h3>{title}</h3> : null}
      {lead ? <p className="feature-card-lead">{lead}</p> : null}
      {children}
    </article>
  );
}
