import type { Metadata } from "next";

export const metadata: Metadata = { title: "Offline" };

/** Styled inline: the service worker serves this page without the app's stylesheet. */
export default function OfflinePage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: "1.5rem",
        fontFamily: "Arial, Helvetica, sans-serif",
        background: "#f8faf7",
        color: "#142217",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "26rem" }}>
        <h1 style={{ fontSize: "2rem", margin: "0 0 0.75rem" }}>You are offline</h1>
        <p style={{ margin: "0 0 1.5rem", lineHeight: 1.6 }}>
          Reconnect to see your latest rewards, transactions and network.
        </p>
        <a
          href=""
          style={{
            display: "inline-block",
            padding: "0.8rem 1.4rem",
            borderRadius: "0.85rem",
            background: "#315c35",
            color: "#ffffff",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Try again
        </a>
      </div>
    </main>
  );
}
