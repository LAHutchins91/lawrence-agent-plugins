# Changelog

All notable changes to **arktype-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ark_types_list` for `type({ ... })` / `type("...")` export/const names → `[{name?, kind: object|stringDef}]`.
- Add `ark_props_hint` for keys inside `type({ ... })` → `[{field, defHint?}]`.
- Add `ark_narrow_hint` for `.narrow(` / `narrow(` usage counts → `[{method, count}]`.
- Add `ark_lint_lite` for empty type, string definition heavy note, missing `.configure`, and no infer export hint.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never `type().assert()`. Lite TypeScript scanner; ~1MB input cap. Document scanner limits. FREE MIT.
