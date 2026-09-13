---
name: veg-lint
description: >
  List Vegeta report / encode / plot APIs (report / encode / NewDecoder /
  NewEncoder / -output / plot / hdrplot / json / hist) and lite-lint for
  missing rate/pacer, missing duration, http:// target, empty file, and
  attack without report/encode. Local only, never runs Vegeta/load tests,
  no fetch.
version: 1.0.0
tags: [vegeta, load-testing, lint, local]
---

# Vegeta reports & lite lint

Use these tools on pasted Vegeta shell/Go/targets source (do not fetch URLs or run Vegeta/load tests):

1. **`veg_reports_hint`** with `source` — → `{reports: [{method, count}], count}`.
2. **`veg_lint_lite`** with `source` — findings:
   - attack without rate/pacer (warning)
   - attack without duration (warning)
   - http:// target (info)
   - Empty file (warning)
   - attack without report/encode (info)

Heuristic only — not the Vegeta CLI or a load-test runtime. Lite scanner.

## Example prompts

- "Any missing -rate or -duration?"
- "Does this script pipe to vegeta report?"
- "Lint this Vegeta file for http targets or missing rate."
