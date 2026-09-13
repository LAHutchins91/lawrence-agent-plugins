---
name: vercel-rewrites-redirects
description: >
  Extract Vercel rewrites and redirects arrays from vercel.json text with the
  local zero-auth vercel-json-lab MCP. No vercel CLI or network.
version: 1.0.0
tags: [vercel, vercel.json, rewrites, redirects, developer-tools]
---

# Vercel rewrites & redirects

When the user pastes **vercel.json** and needs rewrite / redirect inventory:

1. **`vercel_rewrites_list`** — `{ text }` → `{ rewrites: [{source?, destination?, has?}], count }`.
2. **`vercel_redirects_list`** — `{ text }` → `{ redirects: [{source?, destination?, permanent?, statusCode?}], count }`.

## Example prompts

- "List rewrites from this vercel.json"
- "What redirects are configured?"
- "Show catch-all rewrite destinations"
