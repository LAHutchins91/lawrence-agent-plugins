---
name: kb-outputs-plugins
description: "Extract Kubb output paths and plugin references with the local zero-auth kubb-lab MCP. No @kubb/cli / codegen runtime, no network."
version: 1.0.0
tags: [kubb, openapi, codegen, outputs, plugins, developer-tools]
---

# Kubb outputs & plugins

When the user pastes **kubb.config** (`kubb.config.ts` / `.js` / `.json`) and needs output / plugin inventory:

1. **`kb_outputs_list`** — `{ text }` → `{ outputs: [{path?, plugin?}], count }` from root `output.path` / `output` and per-plugin `output.path`.
2. **`kb_plugins_hint`** — `{ text }` → `{ plugins: string[], count }` for `pluginOas`, `pluginTs`, `pluginReactQuery`, `pluginSwr`, `pluginZod`, `pluginClient`, `pluginFaker`, `@kubb/swagger-*`, and string plugin names.

## Example prompts

- "What output paths does this kubb.config declare?"
- "Which Kubb plugins are referenced here?"
- "List per-plugin output folders from this config"
