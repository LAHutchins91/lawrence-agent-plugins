---
name: astro-integrations-output
description: >
  Extract Astro integrations and output/adapter/site/base/trailingSlash from
  astro.config text with the local zero-auth astro-config-lab MCP. defineConfig
  heuristics; no astro binary or network.
version: 1.0.0
tags: [astro, astro-config, integrations, output, adapter, developer-tools]
---

# Astro integrations & output mode

When the user pastes **astro.config** (`astro.config.mjs` / `.ts` / `.js`) and needs integration inventory or deploy mode fields:

1. **`astro_integrations_list`** — `{ text }` → `{ integrations: string[], count }` from `integrations: [...]`.
2. **`astro_output_mode`** — `{ text }` → `{ output?, adapter?, site?, base?, trailingSlash? }`.

## Example prompts

- "Which integrations are in this astro.config.mjs?"
- "Is this Astro site static or server?"
- "What adapter and site URL does this config use?"
