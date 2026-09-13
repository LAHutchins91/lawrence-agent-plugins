---
name: retry-cache-heuristics
description: >
  Advise HTTP client retry/backoff and cacheability from status codes,
  including idempotency caution for POST (local zero-auth MCP).
version: 1.0.0
tags: [http, retry, backoff, cache, idempotency]
---

# Retry & cache heuristics

When designing or reviewing API clients:

1. Call **`retry_advice`** with `{ status, idempotent? }` — treat POST as `idempotent: false` unless keys guarantee safety.
2. Call **`cache_hint`** with `{ status }` for cacheable / conditional / not advice.
3. Combine with **`status_explain`** when the user needs the semantic “why”.

## Example prompts

- "Should I retry a 503 from a POST?"
- "Is 301 safe to cache?"
- "Backoff strategy for 429"
