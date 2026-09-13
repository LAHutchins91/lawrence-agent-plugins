---
name: ckv-lint
description: >
  List Checkov skip keyword counts (checkov:skip= / skip_check /
  soft-fail / quiet / compact / --skip-check) and lite-lint for skip
  without reason, broad skip-all, empty file, soft-fail only, and
  missing framework. Local only, never runs checkov CLI, no fetch.
version: 1.0.0
tags: [checkov, iac, lint, skips, local]
---

# Checkov skips & lite lint

Use these tools on pasted Checkov config / skip-comment source (do not fetch URLs or run checkov CLI):

1. **`ckv_skips_hint`** with `source` — → `{skips: [{method, count}], count}`.
2. **`ckv_lint_lite`** with `source` — findings:
   - skip without reason (warning)
   - broad skip-all (warning)
   - Empty file (warning)
   - soft-fail only (info)
   - missing framework (info)

Disclaimer only — not the checkov CLI. Lite scanner.

## Example prompts

- "Does this checkov:skip include a reason?"
- "Is this skipping all checks?"
- "Lint this Checkov config for soft-fail-only"
