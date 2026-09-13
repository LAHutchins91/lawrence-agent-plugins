---
name: railway-deploy-lint
description: "Extract Railway deploy/build fields and run educational heuristic lite lint on railway.json / railway.toml text with the local zero-auth railway-json-lab MCP. No Railway API, no network."
version: 1.0.0
tags: [railway, railway.json, railway.toml, deploy, lint, developer-tools]
---

# Railway deploy hints & lite lint

When the user wants deploy/build field extraction or a smell-check of pasted Railway config:

1. **`railway_deploy_hint`** — `{ text }` → `{ buildCommand?, startCommand?, watchPatterns?, numReplicas?, healthcheckPath?, restartPolicyType? }`.
2. **`railway_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing start/build, hardcoded secrets in env,
     Dockerfile vs Nixpacks tips. Not an exploit guide.

## Example prompts

- "What startCommand / buildCommand are set?"
- "Lite-lint this railway.toml"
- "Dockerfile or Nixpacks tips for this railway.json?"
