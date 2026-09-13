---
name: sops-lint
description: >
  Lite-lint pasted SOPS config for plaintext password/secret/token keys
  without ENC[, .sops.yaml without creation_rules, empty file, mixed
  age+pgp key types, and path_regex: .* without encrypted_regex.
  Local only, never runs sops CLI, never decrypts, never returns secret
  values, no fetch.
version: 1.0.0
tags: [sops, secrets, lint, local]
---

# SOPS lite lint

Use this tool on pasted SOPS config / encrypted source (do not fetch URLs, run sops CLI, or decrypt):

1. **`sops_lint_lite`** with `source` — findings:
   - plaintext_secretish (warning)
   - missing_creation_rules (info)
   - Empty file (warning)
   - age_and_pgp_mixed (info)
   - path_regex_too_broad (warning)

Disclaimer only — not the sops CLI. Never returns secret values. Lite scanner.

## Example prompts

- "Are there plaintext password keys in this secrets.yaml?"
- "Is this .sops.yaml missing creation_rules?"
- "Lint this SOPS config for broad path_regex / mixed keys"
