"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/icon";

const items: { href: string; label: string; icon: IconName }[] = [
  { href: "/dashboard", label: "Home", icon: "mingcute:home-4-line" },
  { href: "/genealogy", label: "Genealogy", icon: "mingcute:tree-line" },
  { href: "/transactions", label: "Transactions", icon: "mingcute:transfer-line" },
  { href: "/profile", label: "Profile", icon: "mingcute:user-3-line" },
];

export function AppNav() {
  const pathname = usePathname();
  return (
    <nav className="app-nav" aria-label="Main">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            className={`app-nav-link ${active ? "app-nav-link-active" : ""}`}
            href={item.href}
            key={item.href}
            aria-current={active ? "page" : undefined}
          >
            <Icon name={item.icon} size={22} className="app-nav-icon" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
