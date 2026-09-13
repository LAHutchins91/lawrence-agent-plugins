# Changelog

All notable changes to **ajv-schema-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ajv_schemas_list` for top-level `$id` / `title` / `type` (plus `$defs`/`definitions`) → `[{id?, title?, type?}]`.
- Add `ajv_keywords_hint` for `type` / `properties` / `required` / `additionalProperties` / `oneOf` / `anyOf` / `allOf` / `if` / `then` / `else` / `pattern` / `format` → `[{keyword, count}]`.
- Add `ajv_refs_hint` for `$ref` values → `[{ref}]`.
- Add `ajv_lint_lite` for missing `$schema`, `additionalProperties` missing on objects, empty `required`, and draft mismatch heuristics.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no AJV `compile`/`validate`. JSON.parse preferred; ~1MB input cap. Document scanner limits. FREE MIT.
