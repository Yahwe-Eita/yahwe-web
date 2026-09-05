"use client";

import { useRouter } from "next/navigation";
import { useLogout } from "@/hooks/useLogout";

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogout();

  async function logout() {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <button className="logout-button" type="button" onClick={logout} disabled={logoutMutation.isPending}>
      {logoutMutation.isPending ? "Logout" : "Logout"}
    </button>
  );
}
