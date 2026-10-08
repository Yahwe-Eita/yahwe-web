import type { AriaRole, ReactNode } from "react";
import { Logo } from "@/components/logo";
import { AuthTitle } from "@/components/ui/auth-title";
import { IconLink } from "@/components/ui/icon-link";

interface AuthShellProps {
  children: ReactNode;
  backHref?: string;
  title: string;
  description?: string;
  wide?: boolean;
  role?: AriaRole;
}

export function AuthShell({ children, backHref, title, description, wide = false, role }: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Logo />
        {backHref ? <IconLink variant="back" href={backHref} label="Back" icon="mingcute:arrow-left-line" size={24} /> : null}
      </div>
      <div className={`auth-card${wide ? " auth-card-wide" : ""}`} role={role}>
        <AuthTitle>{title}</AuthTitle>
        {description ? <p className="auth-description">{description}</p> : null}
        {children}
      </div>
    </main>
  );
}
