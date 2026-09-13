---
name: sk-deploys-lint
description: "Hint skaffold.yaml deploy.kubectl/helm/kustomize/statusCheck and educational lite lint with the local zero-auth skaffold-lab MCP. No Skaffold CLI, cluster, or network."
version: 1.0.0
tags: [skaffold, deploy, lint, mcp, yaml, developer-tools]
---

# Skaffold deploys & lite lint

When the user pastes **skaffold.yaml** text or wants a smell-check:

1. **`sk_deploys_hint`** — `{ text }` → `{ deploys: [{type?, paths?, releases?}], count }`.
2. **`sk_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing apiVersion/kind, missing build.artifacts, `:latest` tags,
     plaintext secrets in manifests paths tip, remote git repo tip.
   - Not an exploit guide.

## Example prompts

- "What kubectl manifests / helm releases / kustomize paths are in this Skaffold deploy?"
- "Lint this skaffold.yaml for :latest and missing artifacts"
- "Any remote git repo or secret-manifest tips?"
