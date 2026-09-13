# Changelog

All notable changes to **tailwind-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `tw_content_globs` for `content: […]` → glob strings.
- Add `tw_theme_extend_keys` for `theme.extend` object keys → key names.
- Add `tw_plugins_list` for `plugins: [require(…), …]` → `{nameOrCall}`.
- Add `tw_lint_lite` for empty content, missing content, purge leftover (v2), and darkMode missing note when class: used heuristically.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Tailwind binary for tool logic. Lite JS config scanner (`tailwind.config.*` / module.exports / export default); ~1MB input cap. Document limits. FREE MIT.
