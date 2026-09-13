---
name: cosign-lint
description: >
  Lite-lint pasted Cosign config for sign without verify,
  --allow-insecure-registry, empty file, keyless verify without oidc
  issuer/identity, and COSIGN_PASSWORD / cosign.key private-key hints.
  Local only, never runs cosign CLI, no fetch.
version: 1.0.0
tags: [cosign, signing, lint, local]
---

# Cosign lite lint

Use this tool on pasted Cosign config / CI source (do not fetch URLs or run cosign CLI):

1. **`cosign_lint_lite`** with `source` — findings:
   - sign without verify (warning)
   - insecure allow-insecure-registry (warning)
   - Empty file (warning)
   - keyless without issuer (info)
   - private key in repo (warning)

Disclaimer only — not the cosign CLI. Lite scanner.

## Example prompts

- "Does this Cosign CI both sign and verify?"
- "Is this using --allow-insecure-registry?"
- "Lint this Cosign config for keyless / private-key smells"
