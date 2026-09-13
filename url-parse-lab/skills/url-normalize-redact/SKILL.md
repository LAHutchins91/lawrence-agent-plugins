---
name: url-normalize-redact
description: >
  Normalize URLs (default ports, optional sorted query) and redact userinfo plus
  known secret query keys with the local zero-auth url-parse-lab MCP.
version: 1.0.0
tags: [url, normalize, redact, secrets, developer-tools]
---

# URL normalize & redact

When the user needs clean or shareable URLs:

1. **`url_normalize`** — `{ url, sortQuery?: boolean }` → `{ url }`.
   - Drops default ports (http 80 / https 443); optional alphabetical query sort.
2. **`url_redact`** — `{ url }` → `{ url, redacted: string[] }`.
   - Strips `user:pass@`; redacts token/access_token/api_key/key/password/secret/client_secret/auth/authorization/code/refresh_token to `REDACTED`.

## Example prompts

- "Normalize https://example.com:443/path?b=2&a=1 with sorted query"
- "Redact secrets from this URL before I paste it in a ticket"
- "Strip credentials from https://alice:secret@api.example.com/v1?api_key=abc"
