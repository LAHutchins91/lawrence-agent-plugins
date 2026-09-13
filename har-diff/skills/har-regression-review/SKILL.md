---
name: har-regression-review
description: >
  Compare before/after HTTP Archive (HAR) captures for regressions in status,
  timing, and payload size. Summarize traffic shape, then diff by method+path
  and highlight top time/size regressions — local zero-auth MCP, no SaaS.
version: 1.0.0
tags: [har, http-archive, diff, regression, performance, timing, size]
---

# HAR regression review

When the user provides one or two HAR JSON captures (e.g. before/after a deploy):

1. Call **`har_summary`** on each HAR — note host/method/status-family mix, total transfer size, and slowest endpoints.
2. If both before and after are available, call **`har_diff`** with `beforeHar` / `afterHar` (keep `normalizeQueryOrder` true unless told otherwise).
3. Lead with **status regressions**, then **topTimeRegressions** and **topSizeRegressions**; mention added/removed endpoints briefly.
4. Optionally call **`har_failing`** on the after HAR if error rates look elevated.

## Example prompts

- "Diff these two HAR files for timing and size regressions"
- "Summarize this HAR and flag the slowest endpoints"
- "What broke between yesterday's and today's capture?"
