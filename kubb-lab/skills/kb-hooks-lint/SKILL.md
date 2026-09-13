---
name: kb-hooks-lint
description: "Extract Kubb hooks.done / post-generate commands and run educational heuristic lite lint with the local zero-auth kubb-lab MCP. No @kubb/cli, no network."
version: 1.0.0
tags: [kubb, openapi, hooks, lint, config, developer-tools]
---

# Kubb hooks & lite lint

When the user wants hooks extraction or a smell-check of pasted kubb.config:

1. **`kb_hooks_hint`** — `{ text }` → `{ hooks: [{name?, command?}], count }` for `hooks.done` and related post-generate scripts.
2. **`kb_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing input.path / output.path tips, remote OpenAPI URL tip, hardcoded apiKey/Authorization tip, absolute output path tip. Not an exploit guide.

## Example prompts

- "What hooks.done commands does this kubb.config run?"
- "Lite-lint this kubb.config for missing output.path and remote OpenAPI URLs"
- "Any hardcoded apiKey in this Kubb config?"
