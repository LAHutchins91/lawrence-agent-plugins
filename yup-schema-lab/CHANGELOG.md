# Changelog

All notable changes to **yup-schema-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `yup_schemas_list` for `yup.object` / `object({` / `yup.string`… export/const names → `[{name?, kind}]`.
- Add `yup_fields_hint` for keys inside `yup.object({ ... })` / `.shape({ ... })` → `[{field, typeHint?}]`.
- Add `yup_tests_hint` for `.required` / `.email` / `.min` / `.max` / `.matches` / `.oneOf` → `[{method, count}]`.
- Add `yup_lint_lite` for object without required fields note, deprecated `.nullable().required()` order, empty schema, and missing `.strict()`.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no Yup `validate()`. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
