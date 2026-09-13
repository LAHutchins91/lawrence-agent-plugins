---
name: nock-scopes
description: "List nock('https://...') base URL scopes and intercept method counts (.get / .post / .put / .delete / .patch / .head / .options) from pasted nock JS/TS. Local only — never activates nock interceptors, no fetch."
version: 1.0.0
tags: [nock, http-mock, scopes, intercepts, local]
---

# Nock scopes & intercepts

Use these tools when the user pastes nock JS/TS text (never fetch a remote file, never activate nock interceptors):

1. **`nock_scopes_list`** with `source` — → `{scopes: [{baseUrl}], count}`.
2. **`nock_intercepts_hint`** with `source` — → `{methods: [{method, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not nock HTTP mocking runtime; no network).

## Example prompts

- "Which nock base URLs are in this file?"
- "How many .get intercepts are defined?"
- "List nock scopes and HTTP method counts."
