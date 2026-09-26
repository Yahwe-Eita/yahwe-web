"use client";

import { useEffect } from "react";
import { Logo } from "@/components/logo";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="auth-page">
      <div className="auth-topbar">
        <Logo />
      </div>
      <section className="auth-card" role="alert">
        <h1 className="auth-title">Something went wrong</h1>
        <p className="auth-description">The service is temporarily unavailable. Please try again.</p>
        <button className="submit-button" type="button" onClick={reset}>
          Try again
        </button>
      </section>
    </main>
  );
}
