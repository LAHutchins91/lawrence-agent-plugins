---
name: k8s-inventory-images
description: >
  Inventory Kubernetes resources (kinds/names/namespaces) and list container
  images from multi-doc YAML text with the local zero-auth k8s-manifest-lab MCP.
  String/YAML only — no kubectl, cluster, or API.
version: 1.0.0
tags: [kubernetes, k8s, yaml, images, inventory, developer-tools]
---

# K8s inventory & images

When the user pastes **Kubernetes multi-doc YAML** and needs resource inventory or image lists:

1. **`k8s_list_kinds`** — `{ text }` → `{ resources, kinds, count }`.
   - Splits on `---`; reports apiVersion/kind/name/namespace per doc (List kinds flattened).
2. **`k8s_images_list`** — `{ text }` → `{ images: [{image, kind?, name?, container?}], unique }`.
   - Reads `containers` / `initContainers` from Pods and workload pod templates.

## Example prompts

- "What kinds are in this manifest bundle?"
- "List all container images in these YAML docs"
- "Inventory Deployments/Services and their namespaces"
