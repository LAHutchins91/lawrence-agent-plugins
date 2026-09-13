---
name: kubeval-schemas-versions
description: >
  Inventory kubeval --schema-location / schemaLocations and extract
  --kubernetes-version / -v / --openshift hints with the local zero-auth
  kubeval-lab MCP. String / YAML / flag only — no kubeval CLI or network
  schema fetch.
version: 1.0.0
tags: [kubeval, schemas, versions, openshift, k8s, mcp, developer-tools]
---

# Kubeval schemas & versions

When the user pastes **kubeval CLI flags** or a config snippet:

1. **`kubeval_schemas_list`** — `{ text }` → `{ schemas: [{location?}], count }`.
   - Looks for `--schema-location`, `schemaLocations` / `schemaLocation`.
2. **`kubeval_versions_hint`** — `{ text }` → `{ kubernetesVersion?, openshift? }`.
   - Looks for `--kubernetes-version` / `-v`, `--openshift` / `openshift: true`.

## Example prompts

- "Which schema locations are in this kubeval command?"
- "What kubernetes version does this kubeval config target?"
- "Is --openshift set in this paste?"
