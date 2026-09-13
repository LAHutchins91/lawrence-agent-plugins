---
name: grype-lint
description: >
  List Grype ignore keyword counts (.grype.yaml / ignore: / VEX /
  --exclude / CVE-) and lite-lint for ignore without reason, broad
  exclude, empty file, no fail-on, and fail-on critical-only.
  Local only, never runs grype CLI, no fetch.
version: 1.0.0
tags: [grype, security, lint, ignores, local]
---

# Grype ignores & lite lint

Use these tools on pasted Grype config / ignore-file source (do not fetch URLs or run grype CLI):

1. **`grype_ignores_hint`** with `source` — → `{ignores: [{method, count}], count}`.
2. **`grype_lint_lite`** with `source` — findings:
   - ignore without reason (info)
   - broad exclude (warning)
   - Empty file (warning)
   - no fail-on (info)
   - fail-on critical-only (info)

Disclaimer only — not the grype CLI. Lite scanner.

## Example prompts

- "Does this Grype ignore include a reason?"
- "Is this excluding all findings?"
- "Lint this Grype config for missing fail-on"
