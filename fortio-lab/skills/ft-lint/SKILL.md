---
name: ft-lint
description: "List Fortio percentile / histogram fields (-json / -p / Percentile / p50 / p75 / p90 / p99 / p999 / histogram / All done) and lite-lint for missing -qps/-n, high -c without -qps, http:// target, empty file, and load without -t. Local only, never runs Fortio/load tests, no fetch."
version: 1.0.0
tags: [fortio, load-testing, lint, local]
---

# Fortio percentiles & lite lint

Use these tools on pasted Fortio shell/script source (do not fetch URLs or run Fortio/load tests):

1. **`ft_percentiles_hint`** with `source` — → `{percentiles: [{method, count}], count}`.
2. **`ft_lint_lite`** with `source` — findings:
   - fortio load without -qps or -n (warning)
   - high -c without -qps (warning)
   - http:// target (info)
   - Empty file (warning)
   - load without -t (info)

Heuristic only — not the Fortio CLI or a load-test runtime. Lite scanner.

## Example prompts

- "Any missing -qps or -n?"
- "Is concurrency high without an explicit QPS?"
- "Lint this Fortio file for http targets or missing duration."
