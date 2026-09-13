---
name: ab-lint
description: "List ab concurrency / summary fields (-n / -c / -t / -k / Requests per second / Time per request) and lite-lint for missing -n/-t, -c >= -n, http:// target, empty file, and high -n without -k. Local only, never runs ab/load tests, no fetch."
version: 1.0.0
tags: [apachebench, ab, load-testing, lint, local]
---

# ab concurrency & lite lint

Use these tools on pasted ab shell/script source (do not fetch URLs or run ab/load tests):

1. **`ab_concurrency_hint`** with `source` — → `{concurrency: [{method, count}], count}`.
2. **`ab_lint_lite`** with `source` — findings:
   - ab without -n or -t (warning)
   - -c >= -n (warning)
   - http:// target (info)
   - Empty file (warning)
   - high -n without -k (info)

Heuristic only — not the ab CLI or a load-test runtime. Lite scanner.

## Example prompts

- "Any missing -n or -t?"
- "Is concurrency higher than request count?"
- "Lint this ab file for http targets or missing keepalive."
