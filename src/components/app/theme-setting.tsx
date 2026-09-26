"use client";

import { useSyncExternalStore } from "react";
import {
  readThemePreference,
  saveThemePreference,
  THEME_EVENT,
  type ThemePreference,
} from "@/lib/theme";

const options: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Device" },
];

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(THEME_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(THEME_EVENT, onChange);
  };
}

export function ThemeSetting() {
  const theme = useSyncExternalStore<ThemePreference>(subscribe, readThemePreference, () => "system");

  return (
    <fieldset className="settings-group">
      <legend>Appearance</legend>
      <div className="segmented-control" role="radiogroup" aria-label="Theme">
        {options.map((option) => (
          <button
            className={theme === option.value ? "selected" : ""}
            type="button"
            role="radio"
            aria-checked={theme === option.value}
            key={option.value}
            onClick={() => saveThemePreference(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
