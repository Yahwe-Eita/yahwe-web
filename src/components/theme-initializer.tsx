"use client";

import { useEffect } from "react";
import { applyTheme, readThemePreference } from "@/lib/theme";

/** Follows the device setting while the member's preference is "system". */
export function ThemeInitializer() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => applyTheme(readThemePreference());
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);
  return null;
}
