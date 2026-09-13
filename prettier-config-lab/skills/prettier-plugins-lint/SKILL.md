---
name: prettier-plugins-lint
description: List Prettier plugins and run educational heuristic lite lint on Prettier config text with the local zero-auth prettier-config-lab MCP. No prettier binary.
version: 1.0.0
tags: [prettier, prettier-config, plugins, lint, developer-tools]
---

# Prettier plugins & lite lint

When the user wants plugin inventory or quick smell checks from **Prettier config text**:

1. **`prettier_plugins_list`** — `{ text }` → `{ plugins, count }`.
2. **`prettier_lint_lite`** — `{ text }` → `{ findings, findingCount }`.
   - Educational heuristics: empty config, useTabs+tabWidth notes, printWidth extremes,
     trailingComma none/es5 smells, deprecated jsxBracketSameLine, override missing files, etc.
     Not an exploit guide.

## Example prompts

- "What plugins does this Prettier config use?"
- "Lite-lint this .prettierrc for common smells"
- "Is printWidth too wide in this config?"
