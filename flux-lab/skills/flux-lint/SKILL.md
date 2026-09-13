---
name: flux-lint
description: >
  List Flux HelmRelease keys (HelmRelease / chart / values / valuesFrom /
  chartRef / install / upgrade / rollback / test) and lite-lint for missing
  interval, missing sourceRef/chartRef, prune: false, empty file, and insecure
  http:// url. Local only, never runs flux/kubectl, no fetch.
version: 1.0.0
tags: [flux, fluxcd, gitops, yaml, lint, helmrelease, local]
---

# Flux HelmReleases & lite lint

Use these tools on pasted Flux YAML source (do not fetch URLs or run flux/kubectl):

1. **`flux_helmreleases_hint`** with `source` — → `{helmreleases: [{method, count}], count}`.
2. **`flux_lint_lite`** with `source` — findings:
   - source/Kustomization without interval (warning)
   - Kustomization/HelmRelease without sourceRef/chartRef (warning)
   - prune: false (info)
   - Empty file (warning)
   - insecure http:// url (info)

Disclaimer only — not the flux CLI. Lite scanner.

## Example prompts

- "Any missing intervals?"
- "Is prune disabled?"
- "Lint this Flux YAML for insecure http urls"
