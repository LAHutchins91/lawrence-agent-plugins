---
name: hmac-compare
description: Compute HMAC-SHA256 and constant-time-ish compare two hex/digest strings with the local zero-auth hash-lab MCP. Warns against pasting production secrets.
version: 1.0.0
tags: [hmac, sha256, compare, digest, developer-tools]
---

# HMAC & digest compare

When the user needs a keyed digest or safe-ish digest equality check:

1. **`hmac_sha256`** — `{ key, message }` → `{ hex, note }`. Always surface the note: do not paste production secrets into chat.
2. **`hash_compare`** — `{ a, b }` normalizes case, returns `{ equal, aLen, bLen }`. Length mismatch → `equal: false` without a pure early character leak as much as practical in JS.

## Example prompts

- "HMAC-SHA256 of message with key k"
- "Do these two digests match (case-insensitive)?"
