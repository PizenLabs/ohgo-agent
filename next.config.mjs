/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Static export for GitHub Pages (`out/`). Per dist/docs/01-app/02-guides/static-exports.md
  // this is required — `next build` must emit `out/` for the upload-pages-artifact step.
  output: "export",
  // GitHub Project Pages serves under /<repo>; `basePath` prefixes routing +
  // `_next` assets. Per basePath.md, `next/image` src still needs a manual
  // prefix (see lib/base-path.ts) — this only covers framework-owned URLs.
  // Empty locally, `/ohgo-agent` in Actions (workflow sets NEXT_PUBLIC_BASE_PATH).
  // NOTE: keep this an explicit `key: value` pair, NOT the `basePath,`
  // shorthand — actions/configure-pages' config injector (if ever re-enabled)
  // replaces the value identifier in place and would corrupt a shorthand
  // into a bare string (`SyntaxError: Unexpected string`).
  basePath: basePath,
  // Static export has no Image Optimization server (see static-exports.md
  // "Unsupported Features"); serve SVGs/public assets as-is. Keeping the
  // value here (instead of configure-pages injection) makes local
  // `NEXT_PUBLIC_BASE_PATH=/ohgo-agent next build` reproduce Pages faithfully.
  images: { unoptimized: true },
  // Emit `out/<route>/index.html` so GitHub Pages serves clean URLs
  // (e.g. /info) instead of requiring the `.html` suffix.
  trailingSlash: true,
};

export default nextConfig;
