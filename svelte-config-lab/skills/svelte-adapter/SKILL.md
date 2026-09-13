---
name: svelte-adapter
description: "Parse pasted svelte.config.* text locally with zero-auth MCP tools: list preprocess entries, kit.adapter call, and vite.plugins / kit.vite.plugins hints. Lite JS/TS scanner — not Svelte/Vite CLI. Function-form export default may only partially extract. No network, no svelte/vite binary for tool logic."
version: 1.0.0
tags: [svelte, sveltekit, adapter, preprocess, vite, parse, local]
---

# Svelte preprocess / adapter / vite plugins

Use these tools when the user pastes `svelte.config.js` / `.ts` / `.mjs` / `.cjs` text (never fetch a remote config, never run Svelte or Vite for analysis):

1. **`svelte_preprocess_list`** with `configText` — → `{preprocess: [{nameOrCall}]}` from `preprocess: […]` or a single `vitePreprocess()` (or other) call.
2. **`svelte_kit_adapter_hint`** with `configText` — → `{adapterCall?, notes}` from `kit.adapter`.
3. **`svelte_vite_plugins_hint`** with `configText` — → `{plugins: [{nameOrCall}]}` from `vite.plugins` / `kit.vite.plugins` heuristics.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not Svelte/Vite CLI, no full AST; function bodies may only partially extract).

## Example prompts

- "What preprocess steps does this svelte.config.js declare?"
- "Which SvelteKit adapter is set in this pasted config?"
- "Which vite plugins are listed under vite.plugins or kit.vite.plugins?"
