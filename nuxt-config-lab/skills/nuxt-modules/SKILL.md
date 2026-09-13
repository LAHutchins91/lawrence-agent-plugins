---
name: nuxt-modules
description: >
  Parse pasted nuxt.config.* text locally with zero-auth MCP tools:
  list modules, runtimeConfig public/private keys, and routeRules path hints.
  Lite JS/TS scanner — not Nuxt CLI. Function-form defineNuxtConfig may only
  partially extract. No network, no nuxt binary for tool logic.
version: 1.0.0
tags: [nuxt, nuxtjs, modules, runtimeConfig, routeRules, parse, local]
---

# Nuxt modules / runtimeConfig / routeRules

Use these tools when the user pastes `nuxt.config.ts` / `.js` / `.mjs` / `.cjs` text (never fetch a remote config, never run Nuxt for analysis):

1. **`nuxt_modules_list`** with `configText` — → `{modules: [{nameOrPath}]}` from `modules: […]` (string or `[path, options]` tuples).
2. **`nuxt_runtime_config_keys`** with `configText` — → `{keys: [{key, scope: public|private}]}` from `runtimeConfig` / `runtimeConfig.public`.
3. **`nuxt_route_rules_hint`** with `configText` — → `{rules: [{path, ruleKeys[]}]}` from `routeRules` object keys.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not Nuxt CLI, no full AST; function bodies may only partially extract).

## Example prompts

- "What modules does this nuxt.config.ts declare?"
- "List runtimeConfig public vs private keys from this pasted Nuxt config."
- "Which routeRules paths and rule keys are set?"
