---
name: ec-parse-resolve
description: >
  Parse .editorconfig text into sections and resolve effective properties for a
  path with the local zero-auth editorconfig-lab MCP. Best-effort EditorConfig
  globs; no network or disk walk.
version: 1.0.0
tags: [editorconfig, parse, resolve, glob, developer-tools]
---

# EditorConfig parse & resolve

When the user pastes **.editorconfig** text and needs structure or path-specific properties:

1. **`ec_parse`** — `{ text }` → `{ root?, sections:[{name, glob?, properties}], sectionCount }`.
2. **`ec_resolve_for_path`** — `{ text, path }` → `{ matched:[{section, glob?}], properties, path }`.
   - Later matching sections override earlier for the same keys (`[*]` then named globs).

## Example prompts

- "Parse this .editorconfig"
- "What indent settings apply to src/app.ts?"
- "Resolve EditorConfig properties for Makefile"
