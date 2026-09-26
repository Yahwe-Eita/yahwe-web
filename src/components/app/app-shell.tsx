import Link from "next/link";
import type { ReactNode } from "react";
import { AppNav } from "@/components/app/app-nav";
import { LogoutButton } from "@/components/app/logout-button";
import { Icon } from "@/components/icon";
import { Logo } from "@/components/logo";
import type { SessionUser } from "@/lib/api/types";
import { SessionProvider } from "@/providers/session-provider";

export function AppShell({ children, user }: { children: ReactNode; user: SessionUser }) {
  return (
    <SessionProvider user={user}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="app-layout">
        <aside className="app-sidebar">
          <Logo href="/dashboard" />
          <AppNav />
          <LogoutButton />
        </aside>
        <div className="app-main">
          <header className="app-header">
            <strong>{user.name}</strong>
            <div className="app-header-actions">
              <Link className="header-icon" href="/notifications" aria-label="Notifications">
                <Icon name="mingcute:notification-line" size={22} />
              </Link>
              <Link className="header-icon" href="/settings" aria-label="Settings">
                <Icon name="mingcute:settings-3-line" size={22} />
              </Link>
              <Link className="user-avatar" href="/profile" aria-label="Profile">
                {user.name.charAt(0).toUpperCase()}
              </Link>
            </div>
          </header>
          <main className="app-content" id="main-content" tabIndex={-1}>
            {children}
          </main>
        </div>
        <div className="mobile-nav">
          <AppNav />
        </div>
      </div>
    </SessionProvider>
  );
}
