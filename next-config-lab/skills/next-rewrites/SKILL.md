---
name: next-rewrites
description: "Parse pasted next.config.* text locally with zero-auth MCP tools: list rewrites, redirects, and images.domains / remotePatterns hostnames. Lite JS scanner — not Next.js CLI. Async functions may only partially extract. No network, no next binary for tool logic."
version: 1.0.0
tags: [next, nextjs, rewrites, redirects, images, domains, parse, local]
---

# Next rewrites / redirects / images domains

Use these tools when the user pastes `next.config.js` / `.mjs` / `.ts` / `.cjs` text (never fetch a remote config, never run Next for analysis):

1. **`next_rewrites_list`** with `configText` — → `{rewrites: [{source, destination}]}` from `rewrites: […]` or `async rewrites() { return […] }`.
2. **`next_redirects_list`** with `configText` — → `{redirects: [{source, destination, permanent?}]}` from `redirects`.
3. **`next_images_domains`** with `configText` — → `{domains: [string]}` from `images.domains` / `images.remotePatterns` hostname hints.

Lite JS scanner. Input cap ~1MB. Documented limitations apply (not Next CLI, no full AST; async bodies may only partially extract).

## Example prompts

- "What rewrites does this next.config.js declare?"
- "List redirects and whether they are permanent from this pasted Next config."
- "Which image domains / remotePatterns hostnames are allowed?"
