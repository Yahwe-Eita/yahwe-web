import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/app/logout-button";
import { PageHeading } from "@/components/app/page-heading";
import { ThemeSetting } from "@/components/app/theme-setting";
import { ExternalLink } from "@/components/ui/external-link";
import { SettingsGroup } from "@/components/ui/settings-group";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeading title="Settings" />
      <div className="settings-stack">
        <ThemeSetting />
        <SettingsGroup as="nav" label="Account and help">
          <ul className="settings-links">
            <li>
              <Link href="/profile">My account</Link>
            </li>
            <li>
              <Link href="/reset-password">Security</Link>
            </li>
            <li>
              <ExternalLink href="/#faq">
                Help &amp; FAQ
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="/#terms">
                Terms of use
              </ExternalLink>
            </li>
          </ul>
        </SettingsGroup>
        <LogoutButton />
      </div>
    </>
  );
}
