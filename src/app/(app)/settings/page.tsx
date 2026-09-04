import type { Metadata } from "next";
import Link from "next/link";
import { PageHeading } from "@/components/app/page-heading";
import { ThemeSetting } from "@/components/app/theme-setting";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeading eyebrow="Preferences" title="Settings" description="Control this device and find account help." />
      <div className="settings-stack">
        <ThemeSetting />
        <section className="settings-group">
          <h2>Account</h2>
          <p>Account identity and deletion controls are available from your profile.</p>
          <Link className="small-button" href="/profile">Open profile</Link>
        </section>
        <section className="settings-group">
          <h2>Help and legal</h2>
          <div className="settings-links">
            <a href="https://yahwe-eitaglobal.tech/#features" target="_blank" rel="noreferrer">How it works ↗</a>
            <Link href="/onboarding">Terms and conditions</Link>
          </div>
        </section>
      </div>
    </>
  );
}
