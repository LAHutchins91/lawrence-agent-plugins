---
name: pkg-scripts-deps
description: List npm scripts and bucket dependency package-name keys from package.json text with the local zero-auth package-json-lab MCP. JSON string only — no npm install or network.
version: 1.0.0
tags: [package-json, npm, scripts, dependencies, developer-tools]
---

# Package scripts & deps

When the user pastes **package.json** and needs script inventory or dependency bucketing:

1. **`pkg_scripts_list`** — `{ text }` → `{ name?, scripts: [{name, command}], count }`.
   - Reads top-level `name` and `scripts` map.
2. **`pkg_deps_diff`** — `{ text }` → dep key arrays + `onlyInDeps` / `onlyInDev` / `overlap`.
   - Package **names only** (keys), not version ranges.

## Example prompts

- "What scripts are in this package.json?"
- "Which packages are only in dependencies vs only in devDependencies?"
- "Show overlap between deps and devDeps"
