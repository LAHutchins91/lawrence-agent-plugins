# Changelog

All notable changes to **vite-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `vite_plugins_list` for `plugins: [react(), vue(), …]` → `{nameOrCall}`.
- Add `vite_alias_map` for `resolve.alias` object or array → `{find, replacement}`.
- Add `vite_server_proxy_hint` for `server.proxy` entries → `{path, target?}`.
- Add `vite_lint_lite` for missing root/base notes, `server.host` true caution, empty plugins, and `build.outDir` missing when build present.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no vite binary. Lite JS/TS config scanner; ~1MB input cap. Document limits.
