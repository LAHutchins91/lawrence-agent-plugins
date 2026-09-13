---
name: cache-freshness
description: "Estimate HTTP cache freshness from Age, Date, Cache-Control max-age, and Expires using a local heuristic MCP tool. Not a full cache simulator."
version: 1.0.0
tags: [cache-control, age, expires, freshness, http, local]
---

# Cache freshness hint

Use **`cache_freshness_hint`** when the user has response timing / cache headers:

1. Pass `age` and/or `date`, plus `cacheControl` (for `max-age`) and optional `expires`.
2. Optional `now` (ISO or HTTP-date) for deterministic checks.
3. Read `{fresh, ageSeconds?, maxAge?, remainingSeconds?, notes[]}` and always mention this is a **heuristic**, not a full RFC 9111 cache.

Document limits: ignores `Vary`, `stale-while-revalidate`, and most directive interactions beyond notes (`no-store` / `no-cache` force not fresh).

## Example prompts

- "Age: 30, Cache-Control: max-age=60 — still fresh?"
- "Date was 2 minutes ago, max-age=60 — remaining?"
- "Expires in the past with Age 0 — stale?"
