---
name: http-status-guide
description: "Explain and classify HTTP status codes — reason phrases, categories, meanings, and retry guidance (local zero-auth MCP)."
version: 1.0.0
tags: [http, status-codes, rest, api, debug]
---

# HTTP status guide

When the user is debugging HTTP responses or API contracts:

1. Call **`status_explain`** with `{ code }` for a single status’s meaning and retryGuidance.
2. Call **`status_classify`** with `{ codes }` when sorting logs, traces, or batches into buckets.
3. Summarize category counts and highlight unusual or unknown codes.

## Example prompts

- "What does HTTP 422 mean?"
- "Classify these statuses: 200, 301, 404, 429, 503"
- "Is 418 a real production status?"
