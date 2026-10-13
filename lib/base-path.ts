/**
 * Single source of truth for the Pages sub-path prefix.
 *
 * GitHub Project Pages serves the site under `https://<owner>.github.io/<repo>/`,
 * so every root-absolute asset (`/ohgo-logo-pixel.svg`, favicons, …) 404s unless
 * it is prefixed with the repo name. Locally (`next dev`) the prefix must be `""`.
 *
 * Per `dist/docs/01-app/03-api-reference/05-config/01-next-config-js/basePath.md`:
 * `next/link` applies `basePath` automatically, but `next/image` requires the
 * prefix to be added manually in front of `src` — hence this helper.
 *
 * Build wiring:
 * - `next.config.mjs` reads the same env var at build time for `basePath`.
 * - `.github/workflows/nextjs.yml` sets `NEXT_PUBLIC_BASE_PATH=/ohgo-web`.
 * - Local dev leaves it unset → `""`.
 */
function normalize(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (trimmed === "" || trimmed === "/") return "";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

// `NEXT_PUBLIC_*` is inlined into client bundles at build time, so this works
// in both Server Components (metadata) and Client Components (`HomeClient`).
export const BASE_PATH: string = normalize(process.env.NEXT_PUBLIC_BASE_PATH);

/** Prefix a root-absolute public-asset path (`/x.svg`) with the Pages base path. */
export function withBasePath(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const rooted = path.startsWith("/") ? path : `/${path}`;
  return `${BASE_PATH}${rooted}`;
}
