---
name: sk-pipelines-builds
description: >
  Inventory skaffold.yaml pipelines/profiles/apiVersion/metadata.name and hint
  build.artifacts (image/context/dockerfile/builder) with the local zero-auth
  skaffold-lab MCP. String/YAML only — no Skaffold CLI, cluster, or network.
version: 1.0.0
tags: [skaffold, pipelines, builds, yaml, mcp, developer-tools]
---

# Skaffold pipelines & builds

When the user pastes **skaffold.yaml** text:

1. **`sk_pipelines_list`** — `{ text }` → `{ pipelines: [{name?, apiVersion?, profiles?}], profiles: string[], count }`.
2. **`sk_builds_hint`** — `{ text }` → `{ builds: [{image?, context?, dockerfile?, builder?}], count }`.
   - Builders: docker / buildpacks / jib / kaniko / custom.

## Example prompts

- "Parse this skaffold.yaml — name, apiVersion, profiles?"
- "What build artifacts and builders are declared?"
- "List images and Dockerfiles from this Skaffold config"
