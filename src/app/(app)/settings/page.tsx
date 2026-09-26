import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/app/logout-button";
import { PageHeading } from "@/components/app/page-heading";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeading title="Settings" />
      <div className="settings-stack">
        <section className="settings-group">
          <Link href="/profile">My Account</Link>
          <span>Security</span>
          <span>Preferences</span>
        </section>
        <section className="settings-group">
          <div className="settings-links">
            <a href="/#faq" target="_blank" rel="noreferrer">Help &amp; FAQ</a>
            <Link href="/onboarding">Terms Of Use</Link>
          </div>
        </section>
        <LogoutButton />
      </div>
    </>
  );
}
