---
name: hey-lint
description: "List hey output / summary fields (-o / -csv / summary / latency / Requests/sec / Status code distribution) and lite-lint for missing -n/-z, -c >= -n, http:// target, empty file, and -n without -c. Local only, never runs hey/load tests, no fetch."
version: 1.0.0
tags: [hey, load-testing, lint, local]
---

# hey output & lite lint

Use these tools on pasted hey shell/script source (do not fetch URLs or run hey/load tests):

1. **`hey_output_hint`** with `source` — → `{output: [{method, count}], count}`.
2. **`hey_lint_lite`** with `source` — findings:
   - hey without -n or -z (warning)
   - -c >= -n (warning)
   - http:// target (info)
   - Empty file (warning)
   - -n without -c (info)

Heuristic only — not the hey CLI or a load-test runtime. Lite scanner.

## Example prompts

- "Any missing -n or -z?"
- "Is concurrency higher than request count?"
- "Lint this hey file for http targets or missing -c."
