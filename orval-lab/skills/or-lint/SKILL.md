---
name: or-lint
description: "List orval hooks/mode keys (override.mutator / hooks.afterAllFilesWrite / prettier / mock / mode: tags / mode: split / mode: single) and lite-lint for missing input.target, missing output.target, http:// input, empty file, and mock: true without msw. Local only, never runs orval, no fetch."
version: 1.0.0
tags: [orval, openapi, lint, hooks, local]
---

# orval hooks & lite lint

Use these tools on pasted orval.config source (do not fetch URLs or run orval):

1. **`or_hooks_hint`** with `source` — → `{hooks: [{method, count}], count}`.
2. **`or_lint_lite`** with `source` — findings:
   - without input.target (warning)
   - without output.target (warning)
   - input URL http:// (info)
   - Empty file (warning)
   - mock: true without msw (info)

Disclaimer only — not the orval CLI. Lite scanner.

## Example prompts

- "Any missing output.target?"
- "Is mock enabled without MSW?"
- "Lint this orval.config for http:// inputs"
