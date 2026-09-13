---
name: ow-lint
description: "Count ow .minLength/.maxLength/.is/.validate modifiers and lite-lint for ow() without label, empty file, deprecated patterns, and missing isNode check. Local only, never ow() assert, no fetch."
version: 1.0.0
tags: [ow, sindresorhus, lint, validation, local]
---

# Ow modifiers & lite lint

Use these tools on pasted ow JS/TS (do not fetch URLs or call `ow()`):

1. **`ow_modifiers_hint`** with `source` — → `{methods: [{method, count}], count}`.
2. **`ow_lint_lite`** with `source` — findings:
   - ow() without label (warning)
   - Empty file (warning)
   - Deprecated patterns note (info)
   - Missing isNode check hint (info)

Heuristic only — not ow runtime validation. Lite JS/TS scanner.

## Example prompts

- "How many .minLength uses are in this ow file?"
- "Lint this ow usage for missing labels."
- "Any deprecated ow patterns or missing isNode guards?"
