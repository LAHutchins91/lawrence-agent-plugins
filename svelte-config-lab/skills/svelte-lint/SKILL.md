---
name: svelte-lint
description: >
  Lite-lint pasted svelte.config.* for missing kit.adapter on SvelteKit,
  empty preprocess, csrf/checkOrigin notes if present, and kit.alias hints.
  Local only, no svelte/vite binary for tool logic, no fetch.
version: 1.0.0
tags: [svelte, sveltekit, lint, adapter, preprocess, csrf, alias, local]
---

# Svelte lint

Use **`svelte_lint_lite`** with `configText` on pasted Svelte config (do not fetch URLs or run Svelte/Vite for analysis):

- Missing `kit.adapter` when the config looks like SvelteKit (warning)
- Empty `preprocess: []` (warning)
- `csrf` / `checkOrigin` notes if present (info; warning when `checkOrigin: false`)
- `kit.alias` hints if present (info)

Heuristic only — not Svelte CLI / not a full AST. Lite JS/TS config scanner. Function-form `export default` may only partially extract.

## Example prompts

- "Lint this svelte.config.js for a missing kit.adapter."
- "Is csrf checkOrigin false in this pasted SvelteKit config?"
- "Does this config set kit.alias or an empty preprocess list?"
