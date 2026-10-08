"use client";

import { useSyncExternalStore } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SettingsGroup } from "@/components/ui/settings-group";
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
    <SettingsGroup as="fieldset" legend="Preferences">
      <SegmentedControl label="Theme" options={options} value={theme} onChange={saveThemePreference} />
    </SettingsGroup>
  );
}
