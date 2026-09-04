import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="auth-page">
      <div className="auth-topbar"><Logo /></div>
      <section className="auth-card">
        <p className="eyebrow">No connection</p>
        <h1 className="auth-title">You’re offline</h1>
        <p className="auth-description">
          Reconnect to load your latest rewards, transactions, and network data.
        </p>
        <Link className="submit-button" href="/dashboard">Try again</Link>
      </section>
    </main>
  );
}
