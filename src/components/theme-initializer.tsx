"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function apply() {
      const saved = window.localStorage.getItem("yahwe-theme");
      const dark = saved === "dark" || (saved !== "light" && media.matches);
      document.documentElement.dataset.theme = dark ? "dark" : "light";
    }

    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return null;
}
