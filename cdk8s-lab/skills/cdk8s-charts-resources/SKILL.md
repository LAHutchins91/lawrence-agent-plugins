---
name: cdk8s-charts-resources
description: "Inventory cdk8s charts/apps (name, apiVersion, language/runtime) and heuristic resource constructors from program or synth YAML with the local zero-auth cdk8s-lab MCP. YAML/string/regex only — no cdk8s CLI, cluster, or network."
version: 1.0.0
tags: [cdk8s, charts, resources, kubernetes, mcp, developer-tools]
---

# cdk8s charts & resources

When the user pastes **cdk8s.yaml**, Chart.yaml-ish, or cdk8s program / synth YAML:

1. **`cdk8s_charts_list`** — `{ text }` → `{ charts: [{name?, apiVersion?, language?, runtime?, app?, description?, version?}], count }`.
2. **`cdk8s_resources_hint`** — `{ text }` → `{ resources: [{type?, name?, kind?, apiVersion?}], count }`.
   - Looks for `new kplus.Deployment`, `new k8s.KubeService`, `ApiObject`,
     and kind/apiVersion in synth YAML paste.

## Example prompts

- "Parse this cdk8s.yaml — what language and app entry?"
- "What resources does this cdk8s TypeScript chart declare?"
- "List Deployments/Services from this cdk8s synth YAML"
