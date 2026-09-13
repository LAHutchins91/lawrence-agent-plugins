---
name: st-lint
description: "Count Supertest .set('Authorization'…) / .auth( hints and lite-lint for request without expect, missing await, hard-coded bearer tokens (values redacted), and empty file. Local only, never sends HTTP, no fetch."
version: 1.0.0
tags: [supertest, http-test, lint, local]
---

# Supertest auth & lite lint

Use these tools on pasted Supertest JS/TS (do not fetch URLs or send HTTP):

1. **`st_auth_hint`** with `source` — → `{methods: [{method, count}], count}` (never echoes tokens).
2. **`st_lint_lite`** with `source` — findings:
   - Request without expect (warning)
   - Missing await on supertest (warning)
   - Hard-coded bearer tokens caution (warning; values redacted)
   - Empty file (warning)

Heuristic only — not a real HTTP client. Lite JS/TS scanner. Never echo bearer token values.

## Example prompts

- "Does this Supertest file set Authorization headers?"
- "Any request chains missing .expect?"
- "Lint this Supertest usage for missing await or hard-coded tokens."
