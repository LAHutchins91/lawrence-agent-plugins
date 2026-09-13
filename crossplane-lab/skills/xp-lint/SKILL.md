---
name: xp-lint
description: >
  List Crossplane claim keys (claimNames / compositeRef / resourceRef /
  connectionSecretRef / writeConnectionSecretToRef / compositionRef /
  compositionSelector) and lite-lint for missing compositionRef/compositionSelector,
  XRD without claimNames, Provider without ProviderConfig, empty file, and
  insecure package: http://. Local only, never runs crossplane/kubectl, no fetch.
version: 1.0.0
tags: [crossplane, xrd, composition, yaml, lint, claims, local]
---

# Crossplane claims & lite lint

Use these tools on pasted Crossplane YAML source (do not fetch URLs or run crossplane/kubectl):

1. **`xp_claims_hint`** with `source` — → `{claims: [{method, count}], count}`.
2. **`xp_lint_lite`** with `source` — findings:
   - claim/XR without compositionRef/compositionSelector (warning)
   - XRD without claimNames (warning)
   - Provider without ProviderConfig (info)
   - Empty file (warning)
   - insecure package: http:// (info)

Disclaimer only — not the crossplane CLI. Lite scanner.

## Example prompts

- "Any claims missing compositionRef?"
- "Does this XRD define claimNames?"
- "Lint this Crossplane YAML for insecure http packages"
