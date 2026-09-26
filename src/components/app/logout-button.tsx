"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { useLogout } from "@/hooks/useLogout";

export function LogoutButton() {
  const router = useRouter();
  const logout = useLogout();

  function leave() {
    logout.mutate(undefined, {
      onSettled: () => {
        router.replace("/login");
        router.refresh();
      },
    });
  }

  return (
    <button className="logout-button" type="button" onClick={leave} disabled={logout.isPending} aria-busy={logout.isPending || undefined}>
      <Icon name="mingcute:exit-line" size={20} />
      {logout.isPending ? "Logging out…" : "Log out"}
    </button>
  );
}
