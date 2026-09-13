---
name: nuxt-lint
description: "Lite-lint pasted nuxt.config.* for ssr: false note, empty modules, missing runtimeConfig.public, and nitro.preset hints if present. Local only, no Nuxt binary for tool logic, no fetch."
version: 1.0.0
tags: [nuxt, nuxtjs, lint, ssr, modules, runtimeConfig, nitro, local]
---

# Nuxt lint

Use **`nuxt_lint_lite`** with `configText` on pasted Nuxt config (do not fetch URLs or run Nuxt for analysis):

- `ssr: false` note (info)
- Empty `modules: []` (warning)
- Missing `runtimeConfig.public` (warning)
- `nitro.preset` present (info hint)

Heuristic only — not Nuxt CLI / not a full AST. Lite JS/TS config scanner. Function-form `defineNuxtConfig` may only partially extract.

## Example prompts

- "Lint this nuxt.config.ts for empty modules or missing runtimeConfig.public."
- "Is ssr false in this pasted Nuxt config?"
- "Does this config set a nitro preset?"
