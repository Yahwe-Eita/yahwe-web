"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SessionUser } from "@/lib/api/types";

const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: SessionUser;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useSessionUser() {
  const user = useContext(SessionContext);
  if (!user) throw new Error("useSessionUser must be used inside SessionProvider.");
  return user;
}
