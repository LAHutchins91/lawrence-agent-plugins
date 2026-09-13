---
name: trivy-lint
description: >
  List Trivy ignore keyword counts (.trivyignore / trivy:ignore /
  ignorefile / --ignorefile / CVE-) and lite-lint for ignore without
  expiry, broad ignore all, empty file, --exit-code 0, and severity
  CRITICAL-only. Local only, never runs trivy CLI, no fetch.
version: 1.0.0
tags: [trivy, security, lint, ignores, local]
---

# Trivy ignores & lite lint

Use these tools on pasted Trivy config / ignore-file source (do not fetch URLs or run trivy CLI):

1. **`trivy_ignores_hint`** with `source` — → `{ignores: [{method, count}], count}`.
2. **`trivy_lint_lite`** with `source` — findings:
   - ignore without expiry (info)
   - broad ignore all (warning)
   - Empty file (warning)
   - exit-code 0 soft gate (info)
   - severity CRITICAL-only (info)

Disclaimer only — not the trivy CLI. Lite scanner.

## Example prompts

- "Does this trivy:ignore include an expiry?"
- "Is this ignoring all findings?"
- "Lint this Trivy config for exit-code 0"
