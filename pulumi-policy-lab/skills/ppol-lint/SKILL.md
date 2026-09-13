---
name: ppol-lint
description: >
  List Pulumi Policy pack keyword counts (PolicyPack / policyPackArgs /
  policies: / name: / enforcementLevel: / displayName) and lite-lint for
  missing PolicyPack, no enforcementLevel, empty policies, empty file, and
  mandatory rules without message/description. Local only, never runs
  Pulumi CLI, no fetch.
version: 1.0.0
tags: [pulumi, policy, policy-as-code, lint, packs, local]
---

# Pulumi Policy packs & lite lint

Use these tools on pasted Pulumi Policy as Code source (do not fetch URLs or run Pulumi CLI):

1. **`ppol_packs_hint`** with `source` — → `{packs: [{method, count}], count}`.
2. **`ppol_lint_lite`** with `source` — findings:
   - missing PolicyPack (warning)
   - no enforcementLevel (info)
   - empty policies (warning)
   - Empty file (warning)
   - mandatory without message/description (info)

Disclaimer only — not the Pulumi CLI. Lite scanner.

## Example prompts

- "Does this PolicyPack have empty policies?"
- "Any mandatory rules missing a description?"
- "Lint this Pulumi policy for missing PolicyPack"
