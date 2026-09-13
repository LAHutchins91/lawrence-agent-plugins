---
name: tw-content
description: >
  Parse pasted tailwind.config.* text locally with zero-auth MCP tools:
  list content globs, theme.extend object keys, and plugins (require/call text).
  Lite JS scanner — not Tailwind CLI. No network, no tailwindcss binary for tool logic.
version: 1.0.0
tags: [tailwind, content, theme, extend, plugins, parse, local]
---

# Tailwind content / theme.extend / plugins

Use these tools when the user pastes `tailwind.config.js` / `.cjs` / `.ts` / `.mjs` text (never fetch a remote config, never run Tailwind for analysis):

1. **`tw_content_globs`** with `configText` — → `{globs: [string]}` from `content: […]`.
2. **`tw_theme_extend_keys`** with `configText` — → `{keys: [string]}` from `theme.extend` keys (colors, spacing, …).
3. **`tw_plugins_list`** with `configText` — → `{plugins: [{nameOrCall}]}` from `plugins: [require(…), …]`.

Lite JS scanner. Input cap ~1MB. Documented limitations apply (not Tailwind CLI, no full AST).

## Example prompts

- "What content globs does this Tailwind config declare?"
- "Which theme.extend keys are in this pasted tailwind.config.js?"
- "List the plugins require() calls from this Tailwind config."
