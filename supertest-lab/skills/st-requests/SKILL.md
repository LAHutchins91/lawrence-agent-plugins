---
name: st-requests
description: >
  Count request(app).get / .post / .put / .delete / .patch method call sites
  and .expect(status) / .expect('Content-Type'…) hints from pasted Supertest
  JS/TS. Local only — never sends HTTP, no fetch.
version: 1.0.0
tags: [supertest, http-test, requests, expects, local]
---

# Supertest requests & expects

Use these tools when the user pastes Supertest JS/TS text (never fetch a remote file, never send HTTP):

1. **`st_requests_list`** with `source` — → `{methods: [{method, count}], count}`.
2. **`st_expects_hint`** with `source` — → `{kinds: [{kind, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not a real HTTP client; no network).

## Example prompts

- "How many .get requests are in this Supertest file?"
- "What .expect status vs Content-Type counts do we have?"
- "List Supertest HTTP method usage."
