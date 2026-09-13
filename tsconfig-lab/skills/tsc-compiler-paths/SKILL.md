---
name: tsc-compiler-paths
description: >
  Extract compilerOptions and path aliases from tsconfig.json / JSONC text
  with the local zero-auth tsconfig-lab MCP. String-level only — no tsc exec
  or filesystem reads.
version: 1.0.0
tags: [tsconfig, typescript, compilerOptions, paths, developer-tools]
---

# TSConfig compilerOptions & paths

When the user pastes **tsconfig.json** (or JSONC with comments) and needs option inventory or path aliases:

1. **`tsc_compiler_options`** — `{ text }` → `{ compilerOptions, keys }`.
   - Comment-stripped parse; returns the `compilerOptions` object and sorted keys.
2. **`tsc_paths_map`** — `{ text }` → `{ baseUrl?, paths, aliases }`.
   - Normalizes path targets to `string[]`; lists alias keys sorted.

## Example prompts

- "What compilerOptions are set in this tsconfig?"
- "List path aliases and baseUrl"
- "Show me the paths map from this JSONC tsconfig"
