"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { requestJson } from "@/lib/client-api";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await requestJson("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button className="logout-button" type="button" onClick={logout} disabled={pending}>
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
