---
name: wp-loaders-plugins-lint
description: >
  Summarize webpack module.rules loaders, list plugin constructor names, and
  run educational heuristic lite lint with the local zero-auth
  webpack-config-lab MCP. No webpack binary, no network.
version: 1.0.0
tags: [webpack, webpack-config, loaders, plugins, lint, developer-tools]
---

# Webpack loaders, plugins & lite lint

When the user wants a loader/plugin inventory or a smell-check of pasted webpack config text:

1. **`wp_loaders_summary`** — `{ text }` → `{ rules:[{test?, use?, loader?, exclude?}], count }` from `module.rules`.
2. **`wp_plugins_list`** — `{ text }` → `{ plugins: string[], count }` constructor names / require paths from `plugins: [...]`.
3. **`wp_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing entry/output, production without
     optimization tip, deprecated loaders (`file-loader`, `url-loader`,
     `raw-loader`, …), source-map in prod, DefinePlugin secret smells,
     JS no-eval limits. Not an exploit guide.

## Example prompts

- "Which loaders are in this webpack config?"
- "List the webpack plugins in this file"
- "Lite-lint this webpack.config.js"
