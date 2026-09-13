---
name: kw-lint
description: "List kiwi hooks keys (hooks / mutator / transformer / afterGenerate / prettier / eslint) and lite-lint for missing schema, missing output, http:// schema URL, empty file, and client without baseUrl. Local only, never runs kiwi, no fetch."
version: 1.0.0
tags: [kiwi, openapi, lint, hooks, local]
---

# kiwi hooks & lite lint

Use these tools on pasted kiwi.config / OpenAPI client source (do not fetch URLs or run kiwi):

1. **`kw_hooks_hint`** with `source` — → `{hooks: [{method, count}], count}`.
2. **`kw_lint_lite`** with `source` — findings:
   - without input/schema/spec (warning)
   - without output/target (warning)
   - schema URL http:// (info)
   - Empty file (warning)
   - client without baseUrl/baseURL (info)

Disclaimer only — not the kiwi CLI. Lite scanner.

## Example prompts

- "Any missing schema input?"
- "Is there a client without baseUrl?"
- "Lint this kiwi.config for http:// schemas"
