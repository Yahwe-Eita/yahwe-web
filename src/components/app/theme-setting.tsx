"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeSetting() {
  const theme = useSyncExternalStore<Theme>(
    (onChange) => {
      window.addEventListener("storage", onChange);
      window.addEventListener("yahwe-theme-change", onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener("yahwe-theme-change", onChange);
      };
    },
    () => {
      const value = window.localStorage.getItem("yahwe-theme");
      return value === "light" || value === "dark" || value === "system"
        ? value
        : "system";
    },
    () => "system",
  );

  useEffect(() => {
    const dark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [theme]);

  function update(next: Theme) {
    window.localStorage.setItem("yahwe-theme", next);
    window.dispatchEvent(new Event("yahwe-theme-change"));
  }

  return (
    <fieldset className="settings-group">
      <legend>Appearance</legend>
      <p>Choose how Yahwe-Eita appears on this device.</p>
      <div className="segmented-control">
        {(["light", "dark", "system"] as const).map((option) => (
          <button
            className={theme === option ? "selected" : ""}
            type="button"
            key={option}
            onClick={() => update(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
