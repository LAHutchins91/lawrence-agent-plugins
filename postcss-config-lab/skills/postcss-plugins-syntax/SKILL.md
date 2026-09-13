---
name: postcss-plugins-syntax
description: >
  Extract PostCSS plugins and syntax/parser/stringifier from postcss config
  text with the local zero-auth postcss-config-lab MCP. JSONC preferred;
  JS heuristics; no postcss binary or network.
version: 1.0.0
tags: [postcss, postcss-config, plugins, syntax, parser, developer-tools]
---

# PostCSS plugins & syntax

When the user pastes **postcss config** (`postcss.config.*`, `.postcssrc`, or package.json `"postcss"`) and needs plugin inventory or syntax/parser/stringifier:

1. **`postcss_plugins_list`** — `{ text }` → `{ plugins: string[], count }` from `plugins` object keys or array.
2. **`postcss_syntax_hint`** — `{ text }` → `{ syntax?, parser?, stringifier? }`.

## Example prompts

- "Which plugins are in this postcss.config.js?"
- "Does this .postcssrc use postcss-scss?"
- "List plugins from this package.json postcss key"
