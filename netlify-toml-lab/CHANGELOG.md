# Changelog

All notable changes to **netlify-toml-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `netlify_redirects_list` for `[[redirects]]` → `{from, to, status?, force?}`.
- Add `netlify_headers_hint` for `[[headers]]` → `{for, headerKeys[]}`.
- Add `netlify_build_command` for `[build]` command / publish / functions / environment keys.
- Add `netlify_lint_lite` for missing `[build].publish`, SPA redirect `/*` → `/index.html` note, empty redirects, and plugins present (info).
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Netlify CLI. Lite TOML scanner; ~1MB input cap. Document TOML lite limits. FREE MIT.
