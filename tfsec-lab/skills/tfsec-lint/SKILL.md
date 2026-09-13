---
name: tfsec-lint
description: >
  List tfsec ignore keyword counts (tfsec:ignore: / #tfsec:ignore /
  exclude: / --exclude) and lite-lint for ignore without reason, broad
  exclude, empty file, soft-fail only, and minimum-severity HIGH+.
  Local only, never runs tfsec CLI, no fetch.
version: 1.0.0
tags: [tfsec, iac, lint, ignores, local]
---

# tfsec ignores & lite lint

Use these tools on pasted tfsec config / ignore-comment source (do not fetch URLs or run tfsec CLI):

1. **`tfsec_ignores_hint`** with `source` — → `{ignores: [{method, count}], count}`.
2. **`tfsec_lint_lite`** with `source` — findings:
   - ignore without reason (warning)
   - broad exclude (warning)
   - Empty file (warning)
   - soft-fail only (info)
   - minimum-severity HIGH+ (info)

Disclaimer only — not the tfsec CLI. Lite scanner.

## Example prompts

- "Does this tfsec:ignore include a reason?"
- "Is this excluding many checks?"
- "Lint this tfsec config for soft-fail-only"
