import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";

interface AuthShellProps {
  children: ReactNode;
  backHref?: string;
  title: string;
  description?: string;
  wide?: boolean;
}

export function AuthShell({ children, backHref, title, description, wide = false }: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Logo />
        {backHref ? (
          <Link className="back-link" href={backHref} aria-label="Back">
            <Icon name="mingcute:arrow-left-line" size={24} />
          </Link>
        ) : null}
      </div>
      <div className={`auth-card${wide ? " auth-card-wide" : ""}`}>
        <h1 className="auth-title">{title}</h1>
        {description ? <p className="auth-description">{description}</p> : null}
        {children}
      </div>
    </main>
  );
}
