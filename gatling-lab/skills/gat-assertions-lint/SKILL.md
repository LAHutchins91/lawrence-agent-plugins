---
name: gat-assertions-lint
description: >
  Extract Gatling assertions( / global.responseTime / details( / forAll signals
  and run educational heuristic lite lint on Gatling Scala/Java simulation text
  with the local zero-auth gatling-lab MCP. No Gatling/load-test runtime, no network.
version: 1.0.0
tags: [gatling, scala, java, assertions, lint, developer-tools]
---

# Gatling assertions & lite lint

When the user wants assertion inventory or a smell-check of pasted Gatling simulation source:

1. **`gat_assertions_hint`** — `{ text }` → `{ assertions: [{kind}], count }` for `assertions(` / `global.responseTime` / `details(` / `forAll` / etc.
2. **`gat_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing assertions tip, atOnceUsers-only tip,
     hardcoded credentials tip, maxDuration missing tip, etc. Not an exploit guide.

## Example prompts

- "Does this Gatling sim have assertions?"
- "Lite-lint this Simulation for atOnceUsers-only and missing maxDuration"
- "Any hardcoded credentials in this Gatling file?"
