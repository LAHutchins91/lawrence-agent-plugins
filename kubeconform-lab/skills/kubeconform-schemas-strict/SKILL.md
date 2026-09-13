---
name: kubeconform-schemas-strict
description: >
  Inventory kubeconform -schema-location / schemaLocations / kubernetes version
  hints and detect -strict / ignore-missing-schemas / summary with the local
  zero-auth kubeconform-lab MCP. String / YAML / flag only — no kubeconform CLI
  or network schema fetch.
version: 1.0.0
tags: [kubeconform, schemas, strict, k8s, mcp, developer-tools]
---

# Kubeconform schemas & strict

When the user pastes **kubeconform CLI flags** or a config snippet:

1. **`kubeconform_schemas_list`** — `{ text }` → `{ schemas: [{location?, version?}], count }`.
   - Looks for `-schema-location`, `schemaLocations`, `-kubernetes-version` / `kubernetesVersion`.
2. **`kubeconform_strict_hint`** — `{ text }` → `{ strict?, ignoreMissingSchemas?, summary? }`.
   - Looks for `-strict` / `strict: true`, `-ignore-missing-schemas`, `-summary` / summary-only.

## Example prompts

- "Which schema locations are in this kubeconform command?"
- "Is -strict / ignore-missing-schemas set in this paste?"
- "What kubernetes version does this kubeconform config target?"
