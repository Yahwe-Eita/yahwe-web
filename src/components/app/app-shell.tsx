import Link from "next/link";
import type { ReactNode } from "react";
import { AppNav } from "@/components/app/app-nav";
import { LogoutButton } from "@/components/app/logout-button";
import { Logo } from "@/components/logo";
import { initialOf } from "@/components/ui/avatar";
import { IconLink } from "@/components/ui/icon-link";
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
              <IconLink href="/notifications" label="Notifications" icon="mingcute:notification-line" />
              <IconLink href="/settings" label="Settings" icon="mingcute:settings-3-line" />
              <Link className="user-avatar" href="/profile" aria-label="Profile">
                {initialOf(user.name)}
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
