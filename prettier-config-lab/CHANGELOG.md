# Changelog

## 1.0.0 — 2026-09-13

- Initial release of **prettier-config-lab** MCP server.
- Tools: `prettier_options_summary`, `prettier_overrides_list`, `prettier_plugins_list`, `prettier_lint_lite`.
- Prefer robust JSONC; YAML via `yaml` package; best-effort JS string heuristics for `prettier.config.js` / `.prettierrc.js`. No prettier binary; no network.
