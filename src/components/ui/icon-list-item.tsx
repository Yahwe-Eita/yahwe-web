import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/icon";

export function IconListItem({ icon, children }: { icon: IconName; children: ReactNode }) {
  return (
    <li>
      <Icon name={icon} size={22} />
      <span>{children}</span>
    </li>
  );
}
