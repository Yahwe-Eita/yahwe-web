import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function Prose({ animate = false, children }: { animate?: boolean; children: ReactNode }) {
  return animate ? <Reveal className="prose-block">{children}</Reveal> : <div className="prose-block">{children}</div>;
}
