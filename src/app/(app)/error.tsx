"use client";

import { useEffect } from "react";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ButtonLink } from "@/components/ui/button-link";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      icon="!"
      role="alert"
      headingLevel={1}
      animate={false}
      title="This page could not be loaded"
      description="Please try again."
      action={
        <ButtonGroup>
          <Button variant="small" onClick={reset}>
            Retry
          </Button>
          <ButtonLink variant="muted" href="/dashboard">
            Go to home
          </ButtonLink>
        </ButtonGroup>
      }
    />
  );
}
