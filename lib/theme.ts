export type Theme = "light" | "dark";

export const THEME_KEY = "ohgo-theme";

/** Read the persisted theme without touching the DOM (safe for render). */
export function getStoredTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "light" || v === "dark" ? v : null;
  } catch {
    return null;
  }
}

/** Resolve initial theme: stored → OS preference → dark fallback. */
export function resolveInitialTheme(): Theme {
  const stored = getStoredTheme();
  if (stored) return stored;
  try {
    if (window.matchMedia("(prefers-color-scheme: light)").matches)
      return "light";
  } catch {
    /* ignore */
  }
  return "dark";
}

/** Apply theme to <html> + persist. Single DOM write point. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* private mode — theme still applies for the session */
  }
}
