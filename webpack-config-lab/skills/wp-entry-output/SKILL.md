---
name: wp-entry-output
description: "Extract webpack entry points, mode, and output (path/filename/publicPath) from webpack config text with the local zero-auth webpack-config-lab MCP. JSONC preferred; JS/TS heuristics; no webpack binary or network."
version: 1.0.0
tags: [webpack, webpack-config, entry, output, developer-tools]
---

# Webpack entry & output

When the user pastes **webpack config** (`webpack.config.*`, JSONC) and needs entry or output inventory:

1. **`wp_entry_points`** — `{ text }` → `{ entry, entries:[{name?, path?}], mode?, output?:{path?, filename?, publicPath?} }`.

## Example prompts

- "What are the entry points in this webpack config?"
- "Summarize output.path / filename / publicPath from this webpack.config.js"
- "Is this webpack config in production mode?"
