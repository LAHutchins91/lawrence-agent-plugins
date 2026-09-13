---
name: cosign-signs
description: >
  List Cosign sign sources (sign / sign-blob / dockerfile) from pasted
  config/CI and verify/attest method counts (verify / verify-blob /
  --certificate-identity / --certificate-oidc-issuer / --key; attest /
  attach / predicate / --type / slsaprovenance / spdx / cyclonedx).
  Local only — never runs cosign CLI, no fetch.
version: 1.0.0
tags: [cosign, signing, signs, verify, attest, local]
---

# Cosign signs, verify & attest

Use these tools when the user pastes Cosign config or CI text (never fetch a remote file, never run cosign CLI):

1. **`cosign_signs_list`** with `source` — → `{signs: [{kind?, target?}], count}`.
2. **`cosign_verify_hint`** with `source` — → `{verify: [{method, count}], count}`.
3. **`cosign_attest_hint`** with `source` — → `{attest: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not cosign CLI; no network).

## Example prompts

- "Which Cosign sign kinds are in this CI snippet?"
- "Which verify / certificate flags does this Cosign config mention?"
- "What attest / predicate settings appear in this paste?"
