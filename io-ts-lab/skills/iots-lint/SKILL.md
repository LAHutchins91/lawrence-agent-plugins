---
name: iots-lint
description: "Count io-ts t.brand / Brand usage and lite-lint for type vs strict confusion, missing t.exact, empty codec, and no Decoder export hint. Local only, no decode()/encode(), no fetch."
version: 1.0.0
tags: [io-ts, schema, lint, validation, local]
---

# io-ts brand & lite lint

Use these tools on pasted io-ts TypeScript (do not fetch URLs or call io-ts `decode()` / `encode()`):

1. **`iots_brand_hint`** with `source` — → `{methods: [{method, count}], count}`.
2. **`iots_lint_lite`** with `source` — findings:
   - Type vs strict confusion note (info)
   - Missing t.exact (info)
   - Empty codec (warning)
   - No Decoder export hint (info)

Heuristic only — not io-ts runtime validation. Lite TypeScript scanner.

## Example prompts

- "How many t.brand / Brand uses are in this io-ts file?"
- "Lint this io-ts schema for missing t.exact and Decoder exports."
- "Any t.type codecs that should be t.strict?"
