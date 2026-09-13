---
name: yup-lint
description: >
  Count Yup test methods (.required/.email/.min/.max/.matches/.oneOf) and
  lite-lint for object without required fields, deprecated nullable().required()
  order, empty schema, and missing .strict(). Local only, no Yup validate(), no fetch.
version: 1.0.0
tags: [yup, schema, lint, validation, local]
---

# Yup tests & lite lint

Use these tools on pasted Yup schema JS/TS (do not fetch URLs or call Yup `validate()`):

1. **`yup_tests_hint`** with `source` — → `{tests: [{method, count}], count}`.
2. **`yup_lint_lite`** with `source` — findings:
   - Empty schema (warning)
   - Object without `.required()` fields note (info)
   - Deprecated `.nullable().required()` order (warning)
   - Missing `.strict()` (info)

Heuristic only — not Yup runtime validation. Lite JS/TS scanner.

## Example prompts

- "How many .required / .email tests are in this Yup file?"
- "Lint this Yup schema for nullable().required() and missing strict."
- "Any empty or all-optional object schemas?"
