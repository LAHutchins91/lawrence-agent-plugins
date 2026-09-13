---
name: flux-sources
description: "List GitRepository / HelmRepository / OCIRepository / Bucket names and Kustomization hints (Kustomization / path / sourceRef / prune / interval / healthChecks / dependsOn) from pasted Flux YAML. Local only — never runs flux or kubectl, never fetches remote repos, no fetch."
version: 1.0.0
tags: [flux, fluxcd, gitops, yaml, sources, kustomization, local]
---

# Flux sources & Kustomizations

Use these tools when the user pastes Flux YAML text (never fetch a remote file, never run flux/kubectl):

1. **`flux_sources_list`** with `source` — → `{sources: [{kind?, name?}], count}`.
2. **`flux_kustomizations_hint`** with `source` — → `{kustomizations: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not flux CLI; no kubectl; no network).

## Example prompts

- "Which GitRepositories are defined in this YAML?"
- "What Kustomization keys are used (path/sourceRef/prune)?"
- "List HelmRepositories and Buckets from this paste."
