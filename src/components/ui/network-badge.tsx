import type { ReactNode } from "react";

export function NetworkBadge({ children }: { children: ReactNode }) {
  return <div className="network-badge">{children}</div>;
}
