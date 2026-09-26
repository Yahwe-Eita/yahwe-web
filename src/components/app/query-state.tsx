"use client";

import { getErrorMessage } from "@/lib/error-message";

export function QueryLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function QueryError({
  error,
  retry,
  title = "This could not be loaded",
}: {
  error: Error;
  retry: () => void;
  title?: string;
}) {
  return (
    <div className="empty-state" role="alert">
      <span aria-hidden="true">!</span>
      <h2>{title}</h2>
      <p>{getErrorMessage(error, "Check your connection and try again.")}</p>
      <button className="small-button" type="button" onClick={retry}>
        Try again
      </button>
    </div>
  );
}
