---
name: td-verify-lint
description: "Extract td.verify hints and run educational heuristic lite lint on testdouble.js JS/TS text with the local zero-auth testdouble-lab MCP. No testdouble runtime, no network."
version: 1.0.0
tags: [testdouble, td, verify, lint, developer-tools]
---

# Testdouble verify & lite lint

When the user wants verify inventory or a smell-check of pasted testdouble source:

1. **`td_verify_hint`** — `{ text }` → `{ verifies: [{call?, config?}], count }` from `td.verify(`.
2. **`td_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, replace without reset tip, when without verify tip,
     function vs object double tips, etc. Not an exploit guide.

## Example prompts

- "What td.verify calls appear here?"
- "Lite-lint this testdouble test file"
- "Any replaces without td.reset?"
