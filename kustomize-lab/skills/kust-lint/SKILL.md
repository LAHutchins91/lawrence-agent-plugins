---
name: kust-lint
description: >
  List kustomize patches keys (patches / patchesStrategicMerge /
  patchesJson6902 / replacements / transformers / crds) and lite-lint for
  missing resources/bases, secretGenerator plaintext literals, deprecated
  bases:, empty file, and remote http(s):// resources. Local only, never
  runs kustomize/kubectl, no fetch.
version: 1.0.0
tags: [kustomize, kubernetes, lint, patches, local]
---

# kustomize patches & lite lint

Use these tools on pasted kustomization.yaml source (do not fetch URLs or run kustomize/kubectl):

1. **`kust_patches_hint`** with `source` — → `{patches: [{method, count}], count}`.
2. **`kust_lint_lite`** with `source` — findings:
   - without resources/bases (warning)
   - secretGenerator plaintext literals (warning)
   - deprecated bases: (info)
   - Empty file (warning)
   - remote http(s):// resource (info)

Disclaimer only — not the kustomize CLI. Lite scanner.

## Example prompts

- "Any missing resources?"
- "Is there a plaintext secretGenerator?"
- "Lint this kustomization for remote resources"
