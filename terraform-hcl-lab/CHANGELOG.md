# Changelog

All notable changes to **terraform-hcl-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `tf_list_resources` for HCL text → `{type, name}` from `resource "type" "name"` blocks.
- Add `tf_list_modules` for `module "name"` blocks with optional `source`.
- Add `tf_var_lookup` for variable simple attributes (`type`, `default`, `description`).
- Add `tf_lint_lite` for duplicate resource addresses, missing `required_providers` hint, empty module source, and suspicious hardcoded secrets.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no terraform binary. Lite HCL scanner (not a full HCL parser); ~1MB input cap. Document limits.
