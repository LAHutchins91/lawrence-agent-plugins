---
name: qs-merge-diff
description: Merge query overrides onto a base and diff two query maps (added/removed/changed) with the local zero-auth querystring-lab MCP.
version: 1.0.0
tags: [querystring, merge, diff, url, developer-tools]
---

# Merge & diff query maps

When the user needs to combine or compare query strings / param objects:

1. **`qs_merge`** — `{ base, overrides }` → `{ params, query }`. Overrides win. Accepts query strings or objects.
2. **`qs_diff`** — `{ a, b }` → `{ added, removed, changed: [{key, from, to}], unchangedKeys }`.

## Example prompts

- "Merge ?a=1&b=2 with { b: 9, c: 3 }"
- "Diff these two query strings and list what changed"
