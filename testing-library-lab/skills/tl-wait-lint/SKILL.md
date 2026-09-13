---
name: tl-wait-lint
description: "Extract Testing Library waitFor / waitForElementToBeRemoved / findBy hints and run educational heuristic lite lint on JS/TS text with the local zero-auth testing-library-lab MCP. No DOM/@testing-library runtime, no network."
version: 1.0.0
tags: [testing-library, waitFor, lint, developer-tools]
---

# Testing Library waits & lite lint

When the user wants wait inventory or a smell-check of pasted Testing Library source:

1. **`tl_wait_hint`** — `{ text }` → `{ waits: [{kind}], count }` for `waitFor`, `waitForElementToBeRemoved`, `findBy*`.
2. **`tl_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, getBy* in async without findBy/waitFor tip, container queries
     overuse, missing cleanup tip, prefer userEvent over fireEvent, etc. Not an exploit guide.

## Example prompts

- "What waitFor / findBy waits appear here?"
- "Lite-lint this Testing Library test"
- "Any getBy in async without wait, or fireEvent instead of userEvent?"
