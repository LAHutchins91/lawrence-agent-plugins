---
name: bb-latency-lint
description: >
  Extract bombardier latency/print flags (printLatencies / -l / -p) and run
  educational heuristic lite lint on bombardier CLI text with the local
  zero-auth bombardier-lab MCP. No bombardier runtime, no network.
version: 1.0.0
tags: [bombardier, cli, latency, lint, load-test, developer-tools]
---

# Bombardier latency/print & lite lint

When the user wants latency-print inventory or a smell-check of pasted bombardier text:

1. **`bb_latency_hint`** — `{ text }` → `{ latency: [{kind}], count }` for `printLatencies` / `-l` / `-p` / etc.
2. **`bb_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `-c`/`-n` tip, unbounded duration tip,
     no URL tip, etc. Not an exploit guide.

## Example prompts

- "Does this bombardier line print latency percentiles (-l)?"
- "Lite-lint this bombardier command for missing -c/-n and no URL"
- "Any unbounded duration or hardcoded Authorization in this bombardier paste?"
