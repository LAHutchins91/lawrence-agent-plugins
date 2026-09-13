---
name: vercel-headers-lint
description: >
  Extract Vercel headers rules / unique header keys and run educational
  heuristic lite lint on vercel.json text with the local zero-auth
  vercel-json-lab MCP. No vercel CLI, no network.
version: 1.0.0
tags: [vercel, vercel.json, headers, lint, developer-tools]
---

# Vercel headers & lite lint

When the user wants header inventory or a smell-check of pasted vercel.json:

1. **`vercel_headers_hint`** — `{ text }` → `{ headers: [{source?, headers:[{key,value}]}], count, keys: string[] }`.
2. **`vercel_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, trailingSlash tips, catch-all rewrite smells,
     missing security headers tip, builds/functions summary, deprecated routes.
     Not an exploit guide.

## Example prompts

- "What security headers are set in this vercel.json?"
- "Lite-lint this vercel.json"
- "Any catch-all rewrite smells?"
