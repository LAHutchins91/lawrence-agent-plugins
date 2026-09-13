---
name: babel-presets-plugins
description: >
  Extract Babel presets and plugins from babel config text with the local
  zero-auth babel-config-lab MCP. JSONC preferred; JS heuristics; no babel
  binary or network.
version: 1.0.0
tags: [babel, babel-config, presets, plugins, developer-tools]
---

# Babel presets & plugins

When the user pastes **babel config** (`.babelrc`, `babel.config.*`, or package.json `"babel"`) and needs preset/plugin inventory:

1. **`babel_presets_list`** — `{ text }` → `{ presets: (string|object)[], names: string[], count }`.
2. **`babel_plugins_list`** — `{ text }` → `{ plugins: (string|object)[], names: string[], count }`.

## Example prompts

- "Which presets are in this .babelrc?"
- "List plugins from this babel.config.js"
- "Does this config include @babel/preset-typescript?"
