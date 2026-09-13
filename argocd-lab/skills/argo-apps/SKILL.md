---
name: argo-apps
description: >
  List Application / AppProject / ApplicationSet names and source hints
  (repoURL / path / chart / targetRevision / helm / kustomize / directory /
  sources:) from pasted Argo CD YAML. Local only — never runs argocd or
  kubectl, never fetches remote repos, no fetch.
version: 1.0.0
tags: [argocd, argo-cd, yaml, apps, sources, local]
---

# Argo CD apps & sources

Use these tools when the user pastes Argo CD YAML text (never fetch a remote file, never run argocd/kubectl):

1. **`argo_apps_list`** with `source` — → `{apps: [{kind?, name?}], count}`.
2. **`argo_sources_hint`** with `source` — → `{sources: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not argocd CLI; no kubectl; no network).

## Example prompts

- "Which Applications are defined in this YAML?"
- "What source methods are used (helm/kustomize/directory)?"
- "List AppProjects and ApplicationSets from this paste."
