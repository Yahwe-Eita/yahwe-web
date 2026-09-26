"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { SessionUser } from "@/lib/api/types";
import { isSessionEnded } from "@/lib/error-message";

const SessionContext = createContext<SessionUser | null>(null);

/** Sends the member to log in again as soon as any account query reports the session has ended. */
function useEndedSessionRedirect() {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(
    () =>
      queryClient.getQueryCache().subscribe((event) => {
        if (event.type === "updated" && event.action.type === "error" && isSessionEnded(event.action.error)) {
          queryClient.clear();
          router.replace("/login?session=ended");
        }
      }),
    [queryClient, router],
  );
}

export function SessionProvider({ children, user }: { children: ReactNode; user: SessionUser }) {
  useEndedSessionRedirect();
  return <SessionContext.Provider value={user}>{children}</SessionContext.Provider>;
}

export function useSessionUser() {
  const user = useContext(SessionContext);
  if (!user) throw new Error("useSessionUser must be used inside SessionProvider.");
  return user;
}
