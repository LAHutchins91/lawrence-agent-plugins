# Changelog

All notable changes to **kiwi-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `kw_schemas_list` for input / schema / openapi / spec fields → `[{path?, url?}]`.
- Add `kw_clients_hint` for client kinds axios / fetch / ky / got / react-query / swr / graphql → `[{method, count}]`.
- Add `kw_hooks_hint` for hooks / mutator / transformer / afterGenerate / prettier / eslint → `[{method, count}]`.
- Add `kw_lint_lite` for missing_schema, missing_output, http_schema, empty_file, and client_without_baseurl.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs kiwi or codegen, never fetches specs. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
