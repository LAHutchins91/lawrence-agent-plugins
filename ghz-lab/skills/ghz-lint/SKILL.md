---
name: ghz-lint
description: "List ghz concurrency / load flags (-c / --concurrency / -n / --total / -t / --duration / -q / --rps / -z / --connections / --cpus) and lite-lint for missing --call/-n method, missing -proto/--protoset (unless reflection-only), --insecure without TLS, empty file, and high -c without -n/-t. Local only, never runs ghz/load tests, no fetch."
version: 1.0.0
tags: [ghz, grpc, load-testing, lint, local]
---

# ghz concurrency & lite lint

Use these tools on pasted ghz shell/config source (do not fetch URLs or run ghz/load tests):

1. **`ghz_concurrency_hint`** with `source` — → `{concurrency: [{method, count}], count}`.
2. **`ghz_lint_lite`** with `source` — findings:
   - ghz without --call / -n method (warning)
   - without -proto / --protoset when not reflection-only (warning)
   - --insecure without TLS mention (info)
   - Empty file (warning)
   - high -c without -n / -t (info)

Heuristic only — not the ghz CLI or a load-test runtime. Lite scanner.

## Example prompts

- "Any missing --call?"
- "Is concurrency high without an explicit -n or -t?"
- "Lint this ghz file for --insecure or missing proto."
