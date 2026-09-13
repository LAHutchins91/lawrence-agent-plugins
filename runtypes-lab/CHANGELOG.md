# Changelog

All notable changes to **runtypes-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `rt_types_list` for `Record({` / `Object({` / `Array(` / `Union(` / `Literal(` / `String` / `Number` export/const names → `[{name?, kind}]`.
- Add `rt_fields_hint` for keys inside `Record({ ... })` → `[{field, typeHint?}]`.
- Add `rt_constraint_hint` for `.withConstraint(` / `Constraint(` / `.withGuard` usage counts → `[{method, count}]`.
- Add `rt_lint_lite` for empty Record, missing Static export, Optional vs required clarity, and deprecated Intersect note.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never `.check()`/`.guard()`. Lite TypeScript scanner; ~1MB input cap. Document scanner limits. FREE MIT.
