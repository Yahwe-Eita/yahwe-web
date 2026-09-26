export const THEME_KEY = "yahwe-theme";
export const THEME_EVENT = "yahwe-theme-change";

export type ThemePreference = "light" | "dark" | "system";

export function readThemePreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(preference: ThemePreference) {
  const dark =
    preference === "dark" ||
    (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function saveThemePreference(preference: ThemePreference) {
  try {
    window.localStorage.setItem(THEME_KEY, preference);
  } catch {
    // Storage can be unavailable in private browsing; the choice then lasts for this page only.
  }
  applyTheme(preference);
  window.dispatchEvent(new Event(THEME_EVENT));
}

/** Runs before first paint so the saved theme applies without a flash. */
export const themeBootScript = `(function(){var p="system";try{p=localStorage.getItem("${THEME_KEY}")||"system"}catch(e){}var d=p==="dark"||(p!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"})()`;
