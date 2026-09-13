---
name: cy-intercepts-lint
description: "Extract Cypress cy.intercept / cy.route hints and run educational heuristic lite lint on support/commands/spec JS/TS text with the local zero-auth cypress-commands-lab MCP. No Cypress/browser runtime, no network."
version: 1.0.0
tags: [cypress, intercept, lint, developer-tools]
---

# Cypress intercepts & lite lint

When the user wants network stub inventory or a smell-check of pasted Cypress source:

1. **`cy_intercepts_hint`** — `{ text }` → `{ intercepts: [{method?, url?}], count }` for `cy.intercept(` / `cy.route(` (legacy).
2. **`cy_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, `cy.wait(number)` anti-pattern tip, `.then()` overuse tip,
     missing `data-cy` tip, `cy.route` deprecated tip, etc. Not an exploit guide.

## Example prompts

- "What intercepts / routes appear here?"
- "Lite-lint this Cypress support file"
- "Any cy.wait(5000) or deprecated cy.route?"
