---
name: b64-url-codec
description: >
  Encode and decode Base64 / Base64URL and URL component or full URI
  strings with the local zero-auth base64-url-lab MCP.
version: 1.0.0
tags: [base64, base64url, url-encode, codec, developer-tools]
---

# Base64 & URL codec

When the user needs Base64 or URL encoding/decoding:

1. **`b64_encode`** — `{ text, urlSafe? }` for standard or URL-safe Base64.
2. **`b64_decode`** — `{ encoded, urlSafe?, maxChars? }` strict decode; respect truncation / binary refusal notes.
3. **`url_encode`** / **`url_decode`** — `{ text, mode?: "component"|"full" }` (`component` = encodeURIComponent, `full` = encodeURI).

Prefer `urlSafe: true` for JWT segments and URL query tokens.

## Example prompts

- "Base64URL-encode this string"
- "Decode this Base64 — is it binary?"
- "encodeURIComponent this path segment"
