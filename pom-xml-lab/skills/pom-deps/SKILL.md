---
name: pom-deps
description: >
  Parse pasted Maven pom.xml text locally with zero-auth MCP tools:
  extract project groupId/artifactId/version/packaging/parent,
  list project dependencies, and list build plugins.
  Lite XML tag extractor — not Maven. No network, no mvn.
version: 1.0.0
tags: [maven, pom, xml, dependencies, parse, local]
---

# POM deps

Use these tools when the user pastes pom.xml text (never fetch a remote POM, never run mvn):

1. **`pom_coords`** with `pom` — → `{groupId?, artifactId?, version?, packaging?, parent?}`.
2. **`pom_deps_list`** with `pom` — → `{dependencies: [{groupId, artifactId, version?, scope?, optional?}]}` (project deps only, not dependencyManagement).
3. **`pom_plugins_list`** with `pom` — → `{plugins: [{groupId?, artifactId, version?}]}` (build plugins only, not pluginManagement).

Lite XML tag extractor. Input cap ~1MB. Documented limitations apply (not Maven, not full XML).

## Example prompts

- "What are the GAV coordinates and parent of this pasted pom.xml?"
- "List every dependency in this POM, including scope and optional."
- "Which build plugins does this pom.xml declare?"
