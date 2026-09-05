import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/motion/reveal";

interface AuthShellProps {
  children: ReactNode;
  backHref?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  wide?: boolean;
}

export function AuthShell({
  children,
  backHref,
  eyebrow,
  title,
  description,
  wide = false,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Logo />
        {backHref ? (
          <Link className="text-link" href={backHref}>
            <span aria-hidden="true">←</span>
            <span className="sr-only">Back</span>
          </Link>
        ) : null}
      </div>
      <Reveal className={`auth-card${wide ? " auth-card-wide" : ""}`}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="auth-title">{title}</h1>
          {description ? <p className="auth-description">{description}</p> : null}
          {children}
      </Reveal>
    </main>
  );
}
