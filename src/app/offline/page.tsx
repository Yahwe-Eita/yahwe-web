import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="offline-page">
      <div className="offline-content">
        <h1 className="offline-title">You are offline</h1>
        <p className="offline-copy">Reconnect to see your latest rewards, transactions and network.</p>
        <a className="primary-action" href="">
          Try again
        </a>
      </div>
    </main>
  );
}
