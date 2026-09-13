---
name: header-parse-cache
description: >
  Parse raw HTTP header blocks (Name: value, fold/duplicates) and explain
  Cache-Control directives with the local zero-auth http-header-lab MCP.
  Header string analysis only — no network I/O.
version: 1.0.0
tags: [http, headers, cache-control, parse, developer-tools]
---

# Header parse & Cache-Control

When the user needs to inspect a raw header block or a Cache-Control value:

1. **`headers_parse`** — `{ raw }` → `{ headers, keys }`.
   - Lowercase map keys; original names in `keys`. Duplicates become arrays; folded lines join.
2. **`cache_control_explain`** — `{ value }` → `{ directives, notes }`.
   - Covers max-age, s-maxage, no-store, no-cache, private, public, must-revalidate, stale-while-revalidate, and related tokens.

## Example prompts

- "Parse this response header block"
- "What does `Cache-Control: max-age=0, no-cache, private` mean?"
- "Fold these continued header lines and list Set-Cookie values"
