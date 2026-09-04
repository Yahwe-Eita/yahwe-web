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
}

export function AuthShell({
  children,
  backHref,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Logo />
        {backHref ? (
          <Link className="text-link" href={backHref}>
            ← Back
          </Link>
        ) : null}
      </div>
      <Reveal className="auth-card">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="auth-title">{title}</h1>
          {description ? <p className="auth-description">{description}</p> : null}
          {children}
      </Reveal>
    </main>
  );
}
