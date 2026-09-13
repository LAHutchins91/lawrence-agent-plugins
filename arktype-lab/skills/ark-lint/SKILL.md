---
name: ark-lint
description: >
  Count ArkType .narrow( / narrow( usage and lite-lint for empty type, string
  definition heavy note, missing .configure, and no infer export hint. Local
  only, never type().assert(), no fetch.
version: 1.0.0
tags: [arktype, schema, lint, validation, local]
---

# ArkType narrow & lite lint

Use these tools on pasted ArkType TypeScript (do not fetch URLs or call `type().assert()`):

1. **`ark_narrow_hint`** with `source` — → `{methods: [{method, count}], count}`.
2. **`ark_lint_lite`** with `source` — findings:
   - Empty type (warning)
   - String definition heavy note (info)
   - Missing `.configure` (info)
   - No infer export hint (info)

Heuristic only — not ArkType runtime validation. Lite TypeScript scanner.

## Example prompts

- "How many .narrow uses are in this ArkType file?"
- "Lint this ArkType schema for missing configure and infer exports."
- "Any empty type({}) definitions?"
