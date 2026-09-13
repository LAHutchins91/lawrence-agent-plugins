---
name: sg-concurrency-lint
description: >
  Extract siege concurrency / reps / time settings and run educational
  heuristic lite lint on siege CLI / urls.txt / .siegerc text with the local
  zero-auth siege-lab MCP. No siege runtime, no network.
version: 1.0.0
tags: [siege, cli, concurrency, lint, load-test, developer-tools]
---

# Siege concurrency & lite lint

When the user wants concurrency inventory or a smell-check of pasted siege text:

1. **`sg_concurrency_hint`** — `{ text }` → `{ concurrent?, reps?, time? }` from CLI and/or `.siegerc`.
2. **`sg_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `-c` tip, benchmark without delay tip,
     no URL tip, etc. Not an exploit guide.

## Example prompts

- "What concurrent / reps / time does this siege config use?"
- "Lite-lint this siege command for missing -c and no URL"
- "Is -b without -d a smell in this siege paste?"
