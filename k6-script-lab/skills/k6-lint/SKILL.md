---
name: k6-lint
description: >
  List k6 thresholds{} (http_req_duration / http_req_failed / checks /
  custom Rate/Trend/Counter) and lite-lint for missing thresholds,
  sleep-only pacing, http without check, empty file, and
  insecureSkipTLSVerify. Local only, never runs k6/load tests, no fetch.
version: 1.0.0
tags: [k6, load-testing, lint, local]
---

# k6 thresholds & lite lint

Use these tools on pasted k6 JS source (do not fetch URLs or run k6/load tests):

1. **`k6_thresholds_hint`** with `source` — → `{thresholds: [{metric?, expr?}], count}`.
2. **`k6_lint_lite`** with `source` — findings:
   - options without thresholds (warning)
   - sleep( without scenarios/arrival-rate (warning)
   - http.* without check( (warning)
   - Empty file (warning)
   - insecureSkipTLSVerify: true (info)

Heuristic only — not the k6 binary or a load-test runtime. Lite JS scanner.

## Example prompts

- "Any missing thresholds?"
- "Is this script sleep-only paced?"
- "Lint this k6 file for missing checks or insecure TLS."
