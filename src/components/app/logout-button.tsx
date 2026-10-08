"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
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
    <Button variant="logout" onClick={leave} disabled={logout.isPending} aria-busy={logout.isPending || undefined}>
      <Icon name="mingcute:exit-line" size={20} />
      {logout.isPending ? "Logging out…" : "Logout"}
    </Button>
  );
}
