# Changelog

All notable changes to **buf-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `buf_modules_list` for name: / path: / modules: entries → `[{name?, path?}]`.
- Add `buf_deps_hint` for deps: (`buf.build/...`) → `[{module?}]`.
- Add `buf_lint_cfg_hint` for lint/breaking config keys (`use:` / `except:` / `ignore:` / `enum_zero_value_suffix` / `rpc_allow_same_request_response` / `SERVICE_SUFFIX` / `FILE_LOWER_SNAKE_CASE` / `PACKAGE_VERSION_SUFFIX` / `breaking`) → `[{method, count}]`.
- Add `buf_lint_lite` for missing_module_name, deps_without_lock, lint_except_heavy, empty_file, and gen_without_plugins.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs buf CLI or fetches modules. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
