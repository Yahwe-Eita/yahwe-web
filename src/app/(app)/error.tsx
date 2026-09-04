"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="empty-state">
      <span aria-hidden="true">!</span>
      <h2>We couldn’t load this page</h2>
      <p>{error.message || "Please check your connection and try again."}</p>
      <div className="button-row">
        <button className="small-button" type="button" onClick={reset}>
          Try again
        </button>
        <Link className="small-button small-button-muted" href="/dashboard">
          Go home
        </Link>
      </div>
    </div>
  );
}
