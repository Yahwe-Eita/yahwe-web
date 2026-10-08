import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";

export function PersonCard({ name, badge }: { name: string; badge?: ReactNode }) {
  return (
    <article className="person-card">
      <Avatar name={name} />
      <strong>{name}</strong>
      {badge}
    </article>
  );
}
