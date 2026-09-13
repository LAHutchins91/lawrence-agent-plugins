---
name: jsonlint-lint
description: >
  Lite-lint pasted JSON for trailing commas (warning), single quotes
  (warning), empty file (warning), duplicate keys heuristic (info),
  and comments // or /* in JSON (warning). Local only, never runs
  jsonlint CLI, no fetch.
version: 1.0.0
tags: [jsonlint, json, lint, local]
---

# jsonlint lite lint

Use this tool on pasted JSON / jsonlint-related text (do not fetch URLs or run jsonlint CLI):

1. **`jsonlint_lint_lite`** with `source` — findings:
   - trailing_comma (warning)
   - single_quotes (warning)
   - empty_file (warning)
   - duplicate_keys_heuristic (info)
   - comments_in_json (warning)

Disclaimer only — not the jsonlint CLI. Lite scanner. JSON.parse may be used for lite validation only.

## Example prompts

- "Are there trailing commas in this JSON?"
- "Does this JSON use single quotes or comments?"
- "Lint this JSON for duplicate keys"
