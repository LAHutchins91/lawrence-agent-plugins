---
name: argo-lint
description: >
  List Argo CD syncPolicy keys (syncPolicy / automated / prune / selfHeal /
  syncOptions / CreateNamespace / ServerSideApply / retry) and lite-lint for
  missing destination, missing source/sources, automated without prune, empty
  file, and insecure http:// repoURL. Local only, never runs argocd/kubectl,
  no fetch.
version: 1.0.0
tags: [argocd, argo-cd, yaml, lint, sync, local]
---

# Argo CD sync & lite lint

Use these tools on pasted Argo CD YAML source (do not fetch URLs or run argocd/kubectl):

1. **`argo_sync_hint`** with `source` — → `{sync: [{method, count}], count}`.
2. **`argo_lint_lite`** with `source` — findings:
   - Application without destination.server/namespace (warning)
   - without source/sources (warning)
   - automated without prune (info)
   - Empty file (warning)
   - insecure http:// repoURL (info)

Disclaimer only — not the argocd CLI. Lite scanner.

## Example prompts

- "Any missing destinations?"
- "Is automated sync missing prune?"
- "Lint this Application for insecure http repoURLs"
