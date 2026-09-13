---
name: astro-vite-lint
description: "Summarize nested vite block and run educational heuristic lite lint on astro.config text with the local zero-auth astro-config-lab MCP. No astro binary, no network."
version: 1.0.0
tags: [astro, astro-config, vite, lint, developer-tools]
---

# Astro vite hint & lite lint

When the user wants a nested `vite` summary or a smell-check of pasted astro.config text:

1. **`astro_vite_hint`** — `{ text }` → `{ vite?: { plugins?, server?, build?, keys } }`.
2. **`astro_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, output server/hybrid without adapter, missing
     site for sitemap, experimental flags, JS no-eval limits. Not an exploit guide.

## Example prompts

- "What vite plugins does this astro config set?"
- "Lite-lint this astro.config.ts"
- "Does server output have an adapter?"
