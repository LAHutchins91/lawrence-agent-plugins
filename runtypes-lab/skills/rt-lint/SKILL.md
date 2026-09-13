---
name: rt-lint
description: "Count Runtypes .withConstraint( / Constraint( / .withGuard usage and lite-lint for empty Record, missing Static export, Optional vs required clarity, and deprecated Intersect. Local only, never .check()/.guard(), no fetch."
version: 1.0.0
tags: [runtypes, schema, lint, validation, local]
---

# Runtypes constraints & lite lint

Use these tools on pasted Runtypes TypeScript (do not fetch URLs or call `.check()` / `.guard()`):

1. **`rt_constraint_hint`** with `source` — → `{methods: [{method, count}], count}`.
2. **`rt_lint_lite`** with `source` — findings:
   - Empty Record (warning)
   - Missing Static export (info)
   - Optional vs required clarity (info)
   - Deprecated Intersect note (info)

Heuristic only — not Runtypes runtime validation. Lite TypeScript scanner.

## Example prompts

- "How many .withConstraint uses are in this Runtypes file?"
- "Lint this Runtypes schema for missing Static exports."
- "Any empty Record({}) definitions or deprecated Intersect?"
