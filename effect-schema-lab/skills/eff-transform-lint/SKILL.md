---
name: eff-transform-lint
description: "Extract Effect Schema transform/filter/pipe/optional/NullOr/Union chains and run educational heuristic lite lint on schema TS/JS text with the local zero-auth effect-schema-lab MCP. No Effect runtime, no network."
version: 1.0.0
tags: [effect, schema, transform, lint, validation, developer-tools]
---

# Effect Schema transforms & lite lint

When the user wants transform/filter inventory or a smell-check of pasted Effect Schema source:

1. **`eff_transform_hint`** — `{ text }` → `{ transforms: [{on?, kind}], count }` for `transform` / `filter` / `pipe` / `optional` / `NullOr` / `Union` / `brand` etc.
2. **`eff_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing Struct, Any/Unknown overuse, branded ID tips,
     optional vs NullOr, plain email/url String tips, etc. Not an exploit guide.

## Example prompts

- "List Schema.transform / .pipe chains on these schemas"
- "Lite-lint this Effect Schema file"
- "Any Schema.Any overuse or missing brand tips?"
