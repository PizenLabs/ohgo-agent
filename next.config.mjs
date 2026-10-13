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
  // Empty locally, `/ohgo-web` in Actions (workflow sets NEXT_PUBLIC_BASE_PATH).
  basePath,
  // Static export has no Image Optimization server (see static-exports.md
  // "Unsupported Features"); serve SVGs/public assets as-is. `configure-pages`
  // injects the same value in CI — keeping it here makes local
  // `NEXT_PUBLIC_BASE_PATH=/ohgo-web next build` reproduce Pages faithfully.
  images: { unoptimized: true },
};

export default nextConfig;
