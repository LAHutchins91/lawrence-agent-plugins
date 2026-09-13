---
name: sen-lint
description: >
  List HashiCorp Sentinel param keyword counts (param / default / filter / rule /
  when / as / else) and lite-lint for missing main, unused import, empty file,
  print leftover, and param without default. Local only, never runs Sentinel
  CLI, no fetch.
version: 1.0.0
tags: [sentinel, hashicorp, policy, lint, params, local]
---

# Sentinel params & lite lint

Use these tools on pasted Sentinel source (do not fetch URLs or run Sentinel CLI):

1. **`sen_params_hint`** with `source` — → `{params: [{method, count}], count}`.
2. **`sen_lint_lite`** with `source` — findings:
   - missing main (warning)
   - import without use (info)
   - Empty file (warning)
   - hard_fail_print / print( leftover (info)
   - param without default (info)

Disclaimer only — not the Sentinel CLI. Lite scanner.

## Example prompts

- "Does this Sentinel policy define main?"
- "Any unused imports or print leftovers?"
- "Lint this Sentinel for missing defaults"
