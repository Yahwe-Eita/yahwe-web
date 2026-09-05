"use client";

import { getErrorMessage } from "@/lib/error-message";

export function QueryLoading({ label }: { label?: string }) {
  return (
    <div className="loading-state" role="status">
      <span className="spinner" aria-hidden="true" />
      {label ? <p>{label}</p> : null}
    </div>
  );
}

export function QueryError({
  error,
  retry,
  title = "We couldn’t load this data",
  fallback = "Please check your connection and try again.",
  retryLabel = "Try again",
}: {
  error: Error;
  retry: () => void;
  title?: string;
  fallback?: string;
  retryLabel?: string;
}) {
  return (
    <div className="empty-state" role="alert">
      <span aria-hidden="true">!</span>
      <h2>{title}</h2>
      <p>{getErrorMessage(error, fallback)}</p>
      <button className="small-button" type="button" onClick={retry}>
        {retryLabel}
      </button>
    </div>
  );
}
