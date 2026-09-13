---
name: jmx-assertions-lint
description: "Extract JMeter ResponseAssertion / DurationAssertion / JSONPathAssertion signals and run educational heuristic lite lint on JMX / plan XML text with the local zero-auth jmeter-lab MCP. No JMeter/load-test runtime, no network."
version: 1.0.0
tags: [jmeter, jmx, assertions, lint, developer-tools]
---

# JMeter assertions & lite lint

When the user wants assertion inventory or a smell-check of pasted JMeter plan XML:

1. **`jmx_assertions_hint`** — `{ text }` → `{ assertions: [{type, name?}], count }` for `ResponseAssertion` / `DurationAssertion` / `JSONPathAssertion` / etc.
2. **`jmx_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing ThreadGroup tip, no assertions tip,
     hardcoded credentials tip, infinite loop tip, etc. Not an exploit guide.

## Example prompts

- "Does this JMX have ResponseAssertions?"
- "Lite-lint this plan for infinite LoopController and missing ThreadGroup"
- "Any hardcoded credentials in this JMeter file?"
