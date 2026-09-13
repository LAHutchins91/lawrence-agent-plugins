# Changelog

All notable changes to **orval-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `or_outputs_list` for defineConfig / export default / output: / target: / project keys → `[{name?, target?, client?}]`.
- Add `or_client_hint` for client: axios / axios-functions / react-query / solid-query / vue-query / svelte-query / swr / fetch / angular → `[{method, count}]`.
- Add `or_hooks_hint` for override.mutator / hooks.afterAllFilesWrite / prettier / mock / mode: tags / mode: split / mode: single → `[{method, count}]`.
- Add `or_lint_lite` for missing_input, missing_output_target, http_input, empty_file, and mock_without_msw.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs orval or codegen, never fetches specs. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
