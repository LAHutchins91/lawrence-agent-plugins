---
name: art-lint
description: "List Artillery plugins/engines (ensure / expect / metrics-by-endpoint / publish-metrics / apdex / playwright / socketio / ws) and lite-lint for missing phases, http without expect/ensure, high arrivalRate without maxVusers, empty file, and target http://. Local only, never runs Artillery/load tests, no fetch."
version: 1.0.0
tags: [artillery, load-testing, lint, local]
---

# Artillery plugins & lite lint

Use these tools on pasted Artillery YAML/JS source (do not fetch URLs or run Artillery/load tests):

1. **`art_plugins_hint`** with `source` — → `{plugins: [{name, count}], count}`.
2. **`art_lint_lite`** with `source` — findings:
   - config without phases (warning)
   - http flows without expect/ensure (warning)
   - high arrivalRate without maxVusers (info)
   - Empty file (warning)
   - target: http:// non-TLS (info)

Heuristic only — not the Artillery CLI or a load-test runtime. Lite YAML/JS scanner.

## Example prompts

- "Any missing phases?"
- "Does this script use expect/ensure?"
- "Lint this Artillery file for insecure target or high arrival without maxVusers."
