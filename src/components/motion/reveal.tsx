import type { CSSProperties, ReactNode } from "react";

/** Entrance animations are CSS-only so server-rendered content is visible before scripts load. */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const style = delay ? ({ animationDelay: `${delay}s` } as CSSProperties) : undefined;
  return (
    <div className={`reveal ${className}`} style={style}>
      {children}
    </div>
  );
}

export function Stagger({
  children,
  className = "",
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <div className={`stagger ${className}`} aria-label={ariaLabel} role={ariaLabel ? "group" : undefined}>
      {children}
    </div>
  );
}

export function StaggerItem({ children }: { children: ReactNode }) {
  return <div className="motion-item reveal">{children}</div>;
}
