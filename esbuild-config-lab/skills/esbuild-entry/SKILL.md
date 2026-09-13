---
name: esbuild-entry
description: >
  Parse pasted esbuild build options / config text locally with zero-auth MCP tools:
  list entryPoints (name?/path), loader ext→loader map, and external package list.
  Lite JS/TS scanner — not esbuild CLI. No network, no esbuild binary for tool logic.
version: 1.0.0
tags: [esbuild, entryPoints, loader, external, parse, local]
---

# Esbuild entry / loaders / external

Use these tools when the user pastes esbuild `build({…})` or options text (never fetch a remote config, never run esbuild for analysis):

1. **`esbuild_entry_points`** with `configText` — → `{entries: [{name?, path}]}` from `entryPoints` string / array / object.
2. **`esbuild_loaders_map`** with `configText` — → `{loaders: [{ext, loader}]}` from `loader: {…}`.
3. **`esbuild_external_list`** with `configText` — → `{external: [string]}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not esbuild CLI, no full AST).

## Example prompts

- "What entryPoints does this esbuild config declare?"
- "Map loader extensions from this pasted esbuild options object."
- "Which packages are marked external in this build call?"
