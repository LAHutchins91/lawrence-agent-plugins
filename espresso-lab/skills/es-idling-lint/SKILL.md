---
name: es-idling-lint
description: >
  Extract IdlingResource / CountingIdlingResource / registerIdlingResources
  signals and run educational heuristic lite lint on Espresso Java/Kotlin test
  text with the local zero-auth espresso-lab MCP. No Android/Espresso runtime,
  no network.
version: 1.0.0
tags: [espresso, android, idling, lint, developer-tools]
---

# Espresso idling & lite lint

When the user wants idling-resource inventory or a smell-check of pasted Espresso source:

1. **`es_idling_hint`** — `{ text }` → `{ idling: [{kind}], count }` for `IdlingResource` / `CountingIdlingResource` / `registerIdlingResources` / `IdlingRegistry` / etc.
2. **`es_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, `Thread.sleep` antipattern tip, missing IdlingResource tip,
     `withId` overuse tip, etc. Not an exploit guide.

## Example prompts

- "Does this Espresso test register an IdlingResource?"
- "Lite-lint this Espresso file for Thread.sleep"
- "Any withId-only matcher smells?"
