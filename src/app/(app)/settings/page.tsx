import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/app/logout-button";
import { PageHeading } from "@/components/app/page-heading";
import { ThemeSetting } from "@/components/app/theme-setting";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeading title="Settings" />
      <div className="settings-stack">
        <ThemeSetting />
        <nav className="settings-group" aria-label="Account and help">
          <ul className="settings-links">
            <li>
              <Link href="/profile">Your profile</Link>
            </li>
            <li>
              <Link href="/reset-password">Change password</Link>
            </li>
            <li>
              <a href="/#faq" target="_blank" rel="noreferrer">
                Help and FAQ
              </a>
            </li>
            <li>
              <a href="/#terms" target="_blank" rel="noreferrer">
                Terms and conditions
              </a>
            </li>
          </ul>
        </nav>
        <LogoutButton />
      </div>
    </>
  );
}
