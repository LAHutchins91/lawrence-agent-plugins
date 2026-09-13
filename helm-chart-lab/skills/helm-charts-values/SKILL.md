---
name: helm-charts-values
description: "Inventory Helm Chart.yaml metadata/dependencies and hint values.yaml top-level keys / nested image-service-ingress paths with the local zero-auth helm-chart-lab MCP. String/YAML only — no Helm CLI, cluster, or network."
version: 1.0.0
tags: [helm, chart, values, yaml, kubernetes, developer-tools]
---

# Helm charts & values

When the user pastes **Chart.yaml** or **values.yaml** text:

1. **`helm_charts_list`** — `{ text }` → `{ charts: [{name?, version?, apiVersion?, type?, appVersion?, description?, dependencies?}], count }`.
2. **`helm_values_hint`** — `{ text }` → `{ keys, hints: [{path, kind}], secretKeyNames?, count }`.
   - Top-level keys; nested hints for image/tag/replicaCount/service/ingress/resources.
   - Flags secret/password/token **key names** only (never invents values).

## Example prompts

- "Parse this Chart.yaml — name, version, dependencies?"
- "What top-level keys and image/service paths are in these values?"
- "Any password/secret key names in this values.yaml?"
