"use client";

import { useEffect } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";

export default function RootError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AuthShell
      role="alert"
      title="Something went wrong"
      description="The service is temporarily unavailable. Please try again."
    >
      <Button variant="submit" onClick={reset}>
        Try again
      </Button>
    </AuthShell>
  );
}
