# Changelog

All notable changes to **next-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `next_rewrites_list` for `rewrites: […]` / `async rewrites() { return […] }` → `{source, destination}`.
- Add `next_redirects_list` for `redirects: […]` / `async redirects()` → `{source, destination, permanent?}`.
- Add `next_images_domains` for `images.domains` / `images.remotePatterns` hostname hints → domain strings.
- Add `next_lint_lite` for reactStrictMode missing/false, images.unoptimized true note, experimental flags present (info), and empty rewrites.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Next.js binary for tool logic. Lite JS config scanner (`next.config.*` / module.exports / export default); ~1MB input cap. Document limits (async functions may only partially extract). FREE MIT.
