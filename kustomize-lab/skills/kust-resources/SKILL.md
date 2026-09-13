---
name: kust-resources
description: >
  List resources: / bases: / components: entries and overlay hints
  (namespace / namePrefix / nameSuffix / commonLabels / commonAnnotations /
  images / configMapGenerator / secretGenerator / replicas) from pasted
  kustomization.yaml. Local only — never runs kustomize or kubectl, never
  fetches remote resources, no fetch.
version: 1.0.0
tags: [kustomize, kubernetes, resources, overlays, local]
---

# kustomize resources & overlays

Use these tools when the user pastes kustomization.yaml text (never fetch a remote file, never run kustomize/kubectl):

1. **`kust_resources_list`** with `source` — → `{resources: [{path?}], count}`.
2. **`kust_overlays_hint`** with `source` — → `{overlays: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not kustomize CLI; no kubectl; no network).

## Example prompts

- "Which resources are listed in this kustomization?"
- "What overlay transforms are set?"
- "List bases/components from this kustomization.yaml."
