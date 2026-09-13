# Changelog

All notable changes to **ow-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ow_predicates_list` for `ow.string` / `ow.number` / `ow.boolean` / `ow.array` / `ow.object` / `ow.any` / `ow.optional` counts → `[{predicate, count}]`.
- Add `ow_shapes_hint` for `ow.object.partialShape` / `exactShape` / `ow.array.ofType` heuristics → `[{kind, count}]`.
- Add `ow_modifiers_hint` for `.minLength` / `.maxLength` / `.is` / `.validate` usage counts → `[{method, count}]`.
- Add `ow_lint_lite` for ow() without label, empty file, deprecated patterns note, and missing isNode check hint.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never `ow()` assert. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
