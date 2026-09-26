"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="empty-state" role="alert">
      <span aria-hidden="true">!</span>
      <h1>This page could not be loaded</h1>
      <p>Check your connection and try again.</p>
      <div className="button-row">
        <button className="small-button" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="small-button small-button-muted" href="/dashboard">
          Go to home
        </Link>
      </div>
    </div>
  );
}
