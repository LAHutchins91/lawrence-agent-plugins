---
name: fc-constraints-lint
description: "Extract fast-check constraint option keys (minLength, max, seed, numRuns, …) and run educational heuristic lite lint on JS/TS text with the local zero-auth fast-check-lab MCP. No fast-check runtime, no network."
version: 1.0.0
tags: [fast-check, constraints, lint, property-based-testing, developer-tools]
---

# Fast-check constraints & lite lint

When the user wants constraint-option inventory or a smell-check of pasted fast-check source:

1. **`fc_constraints_hint`** — `{ text }` → `{ constraints: [{on?, keys: string[]}], count }` for options objects passed to arbs / assert (`minLength`, `maxLength`, `min`, `max`, `size`, `seed`, `numRuns`, etc.).
2. **`fc_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, assert without property, missing seed tip, unbounded integer tip,
     anything/object overuse, etc. Not an exploit guide.

## Example prompts

- "What min/max/size constraints appear on these arbitraries?"
- "Lite-lint this fast-check file"
- "Any unbounded fc.integer() or missing seed on assert?"
