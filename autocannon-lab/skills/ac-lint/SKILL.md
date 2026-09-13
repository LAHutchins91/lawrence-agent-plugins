---
name: ac-lint
description: >
  List autocannon metrics / handlers (latency / requests / throughput /
  errors / timeouts / non2xx / 2xx / statusCodeStats / on('done' /
  .then(result) and lite-lint for missing duration/amount, high
  connections without workers, http:// target, empty file, and no result
  handler. Local only, never runs autocannon/load tests, no fetch.
version: 1.0.0
tags: [autocannon, load-testing, lint, local]
---

# Autocannon metrics & lite lint

Use these tools on pasted autocannon JS source (do not fetch URLs or run autocannon/load tests):

1. **`ac_metrics_hint`** with `source` — → `{metrics: [{method, count}], count}`.
2. **`ac_lint_lite`** with `source` — findings:
   - autocannon without duration or amount (warning)
   - connections >= 1000 without workers (warning)
   - http:// target (info)
   - Empty file (warning)
   - autocannon( without done / track / await (info)

Heuristic only — not the autocannon CLI or a load-test runtime. Lite JS scanner.

## Example prompts

- "Any missing duration or amount?"
- "Does this script handle results?"
- "Lint this autocannon file for http targets or high connections."
