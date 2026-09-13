---
name: waypoint-deploys-lint
description: >
  Extract Waypoint deploy / release hints (kubernetes, nomad, docker, helm)
  plus educational lite lint with the local zero-auth waypoint-lab MCP.
  No waypoint CLI, deploy, or network. Never invents credentials;
  not an exploit guide.
version: 1.0.0
tags: [waypoint, deploy, release, lint, hcl, mcp, developer-tools]
---

# Waypoint deploys & lite lint

When the user pastes **Waypoint** deploy/release HCL or wants a smell-check:

1. **`waypoint_deploys_hint`** — `{ text }` → `{ deploys: [{app?, use?}], releases?: string[], count }`.
   - Deploy and release `use` plugins (kubernetes, nomad, docker, helm).
2. **`waypoint_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing app/build/deploy, `:latest` images, plaintext secrets/env
     (key *names* only).
   - Not an exploit guide; never invents credentials.

## Example prompts

- "What deploy/release plugins are in this waypoint.hcl?"
- "Lint this Waypoint HCL for :latest images or plaintext env secrets"
- "Any missing build/deploy blocks in this paste?"
