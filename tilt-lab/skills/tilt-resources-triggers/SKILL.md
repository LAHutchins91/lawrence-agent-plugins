---
name: tilt-resources-triggers
description: >
  Inventory Tiltfile resources (docker_build/custom_build, k8s_yaml/k8s_resource,
  local_resource, dc_resource/docker_compose) and hint deps/resource_deps/trigger_mode
  with the local zero-auth tilt-lab MCP. Regex/string only — no Tilt CLI, cluster, or network.
version: 1.0.0
tags: [tilt, tiltfile, resources, triggers, mcp, developer-tools]
---

# Tilt resources & triggers

When the user pastes **Tiltfile** text:

1. **`tilt_resources_list`** — `{ text }` → `{ resources: [{kind, name?, image?}], count }`.
2. **`tilt_triggers_hint`** — `{ text }` → `{ triggers: [{resource?, deps?, resourceDeps?, triggerMode?}], count }`.
   - Looks for `deps=`, `resource_deps=`, `trigger_mode`, `auto_init`, `labels`, `links`.

## Example prompts

- "Parse this Tiltfile — what resources and images are declared?"
- "What resource_deps / trigger_mode settings are set?"
- "List docker_build and local_resource names from this Tiltfile"
