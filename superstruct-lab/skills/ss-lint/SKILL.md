---
name: ss-lint
description: >
  Count Superstruct coerce(/mask(/create( usage and lite-lint for empty object,
  missing optional vs required clarity, deprecated patterns note, and no Infer
  type export. Local only, no assert()/validate(), no fetch.
version: 1.0.0
tags: [superstruct, schema, lint, validation, local]
---

# Superstruct coercion & lite lint

Use these tools on pasted Superstruct JS/TS (do not fetch URLs or call Superstruct `assert()` / `validate()`):

1. **`ss_coercion_hint`** with `source` — → `{methods: [{method, count}], count}`.
2. **`ss_lint_lite`** with `source` — findings:
   - Empty object (warning)
   - Missing optional vs required clarity (info)
   - Deprecated patterns note (info)
   - No Infer type export hint (info)

Heuristic only — not Superstruct runtime validation. Lite JS/TS scanner.

## Example prompts

- "How many coerce/mask/create calls are in this Superstruct file?"
- "Lint this Superstruct schema for empty objects and missing Infer exports."
- "Any all-required object structs without optional()?"
