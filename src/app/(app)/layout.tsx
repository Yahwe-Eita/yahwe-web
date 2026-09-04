import type { ReactNode } from "react";
import { AppShell } from "@/components/app/app-shell";
import { requireSession } from "@/lib/server/data";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();
  return <AppShell user={session.user}>{children}</AppShell>;
}
