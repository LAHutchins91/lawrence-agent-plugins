---
name: prettier-options-overrides
description: Summarize core Prettier options and list overrides from Prettier config text with the local zero-auth prettier-config-lab MCP. JSONC preferred; YAML/JS heuristics; no prettier binary or network.
version: 1.0.0
tags: [prettier, prettier-config, options, overrides, developer-tools]
---

# Prettier options & overrides

When the user pastes **Prettier config** (`.prettierrc*`, YAML, JS, or `package.json` prettier key) and needs options inventory or overrides:

1. **`prettier_options_summary`** — `{ text }` → `{ options, keys }`.
   - Core options (printWidth, tabWidth, useTabs, semi, singleQuote, trailingComma, …).
2. **`prettier_overrides_list`** — `{ text }` → `{ overrides:[{files?, options?}], count }`.

## Example prompts

- "What Prettier options are set in this config?"
- "List the overrides in this .prettierrc"
- "Summarize printWidth / trailingComma from this prettier config"
