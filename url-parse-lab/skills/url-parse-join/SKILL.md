---
name: url-parse-join
description: >
  Parse absolute URLs and resolve relative URLs against a base using the local
  zero-auth url-parse-lab MCP (WHATWG URL). No network fetches.
version: 1.0.0
tags: [url, parse, join, whatwg, developer-tools]
---

# URL parse & join

When the user needs to inspect or resolve URLs:

1. **`url_parse`** — `{ url }` → `{ scheme, username?, host, port?, path, query, queryParams?, hash, origin?, error? }`.
   - Uses the WHATWG URL parser.
2. **`url_join`** — `{ base, relative }` → `{ url, error? }`.
   - Resolves `relative` against `base`.

## Example prompts

- "Parse https://user@example.com:8443/a/b?x=1#frag"
- "Join /docs/api against https://example.com/app/"
- "What is the host and query of this URL?"
