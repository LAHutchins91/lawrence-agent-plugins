# Changelog

All notable changes to **superstruct-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ss_structs_list` for `object({` / `struct(` / `type(` export/const names → `[{name?, kind}]`.
- Add `ss_fields_hint` for keys inside `object({ ... })` / `type({ ... })` → `[{field, typeHint?}]`.
- Add `ss_coercion_hint` for `coerce(` / `mask(` / `create(` usage counts → `[{method, count}]`.
- Add `ss_lint_lite` for empty object, missing optional vs required clarity, deprecated patterns note, and no Infer type export hint.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Superstruct `assert()`/`validate()`. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
