"use client";

import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
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
    <EmptyState
      icon="!"
      role="alert"
      animate={false}
      title={title}
      description={getErrorMessage(error, "Please try again.")}
      action={
        <Button variant="small" onClick={retry}>
          Retry
        </Button>
      }
    />
  );
}
