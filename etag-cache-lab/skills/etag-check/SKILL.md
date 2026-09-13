---
name: etag-check
description: "Normalize ETags, compare weak vs strong entity-tags, and check If-None-Match conditional requests locally with zero-auth MCP tools. No network."
version: 1.0.0
tags: [etag, if-none-match, http, cache, headers, local]
---

# ETag check & If-None-Match

Use these tools when the user pastes ETag / If-None-Match header text:

1. **`etag_normalize`** with `etag` — strip `W/` and quotes → `{raw, weak, value, quoted}`.
2. **`weak_etag_compare`** with `a` + `b` — RFC 9110 `{equalStrong, equalWeak}` (opaque-tag match ignores weakness).
3. **`if_none_match_check`** with `etag` + `ifNoneMatch` — `*` or multi-etag list → `{match, matchedTag?, would304}` using **weak** comparison.

String analysis of pasted text only. Do not fetch URLs or probe live caches.

## Example prompts

- "Normalize `W/\"abc123\"`."
- "Does `\"v1\"` weakly match `W/\"v1\"`?"
- "Resource ETag `\"xyz\"`, client sent `If-None-Match: W/\"xyz\", \"other\"` — 304?"
