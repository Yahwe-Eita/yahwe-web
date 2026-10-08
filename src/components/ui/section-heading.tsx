import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

export function SectionHeading({ animate = true, children }: { animate?: boolean; children: ReactNode }) {
  return animate ? <Reveal className="section-heading">{children}</Reveal> : <div className="section-heading">{children}</div>;
}
