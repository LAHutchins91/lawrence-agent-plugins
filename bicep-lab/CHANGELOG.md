# Changelog

All notable changes to **bicep-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `bicep_params_list` for params → `[{name?, type?}]`.
- Add `bicep_resources_hint` for resource Microsoft.* type counts → `[{method, count}]`.
- Add `bicep_modules_hint` for module / existing / output / var / targetScope → `[{method, count}]`.
- Add `bicep_lint_lite` for missing_target_scope, param_without_type, insecure_http_module, empty_file, and secret_param_name.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Azure CLI or bicep CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
