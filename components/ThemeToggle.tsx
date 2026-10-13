"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { applyTheme, resolveInitialTheme, type Theme } from "@/lib/theme";

/**
 * Pixel-styled light/dark toggle. Persists to localStorage (`ohgo-theme`),
 * falls back to `prefers-color-scheme`, and writes `data-theme` on <html>.
 * Respects reduced motion (icon swap is instant, no animation).
 */
function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initial =
      (document.documentElement.dataset.theme as Theme) === "light"
        ? ("light" as Theme)
        : resolveInitialTheme();
    document.documentElement.dataset.theme = initial;
    setTheme(initial);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      applyTheme(next);
      return next;
    });
  }, []);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isLight}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      className="pixel-btn text-xs !py-1 !px-2.5"
    >
      <span aria-hidden className="inline-flex items-center gap-1.5">
        {isLight ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M8 1h1v2H7V1h1zm0 12h1v2H7v-2h1zM1 8h2v1H1V8zm12 0h2v1h-2V8zM3 2h1v1H3V2zm10 0h1v1h-1V2zM3 13h1v1H3v-1zm10 0h1v1h-1v-1zM4.5 4.5l.7-.7.7.7-.7.7-.7-.7zm7 7l.7-.7.7.7-.7.7-.7-.7zM11.5 4.5l-.7-.7-.7.7.7.7.7-.7zM4.5 11.5l-.7-.7-.7.7.7.7.7-.7zM8 5a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
            <path d="M12 2h-1v1h1V2zM4 3H3v1h1V3zm1 0h1V2H5v1zm7 1h1V3h-1v1zM3 5H2v1h1V5zm12 0h-1v1h1V5zM2 7H1v1h1V7zm13 0h-1v1h1V7zM3 9H2v1h1V9zm11 0h-1v1h1V9zM4 11H3v1h1v-1zm8 0h1v-1h-1v1zM5 13H4v1h1v-1zm4 0h1v-1H9v1zm-2 1H6v1h1v-1z" />
            <path d="M9 3C6 3 4 6 4 9c0 3 2 5 5 5 1 0 2 0 3-1-2 0-4-2-4-5s2-5 4-5c-1-1-2 0-3 0z" />
          </svg>
        )}
        {isLight ? "LIGHT" : "DARK"}
      </span>
    </button>
  );
}

export default memo(ThemeToggle);
