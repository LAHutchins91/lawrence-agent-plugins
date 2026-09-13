---
name: rollup-plugins-lint
description: "List Rollup plugin constructor/factory names and run educational heuristic lite lint with the local zero-auth rollup-config-lab MCP. No rollup binary, no network."
version: 1.0.0
tags: [rollup, rollup-config, plugins, lint, developer-tools]
---

# Rollup plugins & lite lint

When the user wants a plugin inventory or a smell-check of pasted rollup config text:

1. **`rollup_plugins_list`** — `{ text }` → `{ plugins: string[], count }` constructor / factory names from `plugins: [...]`.
2. **`rollup_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing input/output, UMD/IIFE without `name`,
     external tips, deprecated options (`moduleName`, `legacy`, …), sourcemap
     tips, JS no-eval limits. Not an exploit guide.

## Example prompts

- "Which plugins are in this rollup config?"
- "Lite-lint this rollup.config.mjs"
- "Does this UMD output need a global name?"
