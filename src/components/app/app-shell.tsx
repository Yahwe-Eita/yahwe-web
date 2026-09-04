import Link from "next/link";
import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/api/types";
import { AppNav } from "@/components/app/app-nav";
import { LogoutButton } from "@/components/app/logout-button";
import { Logo } from "@/components/logo";

export function AppShell({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser;
}) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Logo href="/dashboard" />
        <AppNav />
        <LogoutButton />
      </aside>
      <div className="app-main">
        <header className="app-header">
          <div>
            <span className="app-header-kicker">Yahwe-Eita</span>
            <strong>{user.name}</strong>
          </div>
          <div className="app-header-actions">
            <Link href="/notifications" aria-label="Notifications">
              Notifications
            </Link>
            <Link className="user-avatar" href="/profile" aria-label="Open profile">
              {user.name.charAt(0).toUpperCase()}
            </Link>
          </div>
        </header>
        <div className="app-content">{children}</div>
      </div>
      <div className="mobile-nav">
        <AppNav />
      </div>
    </div>
  );
}
