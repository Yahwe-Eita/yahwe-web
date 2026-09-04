"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/genealogy", label: "Genealogy", icon: "♧" },
  { href: "/transactions", label: "Transactions", icon: "↔" },
  { href: "/profile", label: "Profile", icon: "○" },
] as const;

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav className="app-nav" aria-label="Application navigation">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            className={`app-nav-link ${active ? "app-nav-link-active" : ""}`}
            href={item.href}
            key={item.href}
            aria-current={active ? "page" : undefined}
          >
            <motion.span
              className="app-nav-icon"
              aria-hidden="true"
              animate={{ scale: active ? 1.08 : 1, y: active ? -1 : 0 }}
            >
              {item.icon}
            </motion.span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
