---
name: waypoint-apps-builds
description: >
  Inventory Waypoint apps (name, labels) and extract build / use
  (docker, pack, etc.) plus registry hints with the local zero-auth
  waypoint-lab MCP. String/regex only — no waypoint CLI, deploy, or network.
version: 1.0.0
tags: [waypoint, hcl, app, build, docker, pack, mcp, developer-tools]
---

# Waypoint apps & builds

When the user pastes **Waypoint** `waypoint.hcl` (app / build blocks):

1. **`waypoint_apps_list`** — `{ text }` → `{ apps: [{name?, labels?}], count }`.
2. **`waypoint_builds_hint`** — `{ text }` → `{ builds: [{app?, use?, registry?}], count }`.
   - Looks for `build { use "docker"|"pack"|… }` and nested `registry` image/use hints.

## Example prompts

- "List the Waypoint apps and labels in this waypoint.hcl"
- "Which build plugins (docker/pack) and registries does this config use?"
- "Inventory apps and build/use blocks in this paste"
