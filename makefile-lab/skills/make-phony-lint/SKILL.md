---
name: make-phony-lint
description: "Collect .PHONY names and run educational heuristic lite lint on Makefile text with the local zero-auth makefile-lab MCP. No make binary, no network, no shell."
version: 1.0.0
tags: [makefile, make, phony, lint, developer-tools]
---

# Makefile .PHONY & lite lint

When the user wants `.PHONY` inventory or a smell-check of pasted Makefile text:

1. **`make_phony_list`** — `{ text }` → `{ phony: string[], count }` from `.PHONY:` declarations.
2. **`make_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: tabs vs spaces in recipe lines, missing `.PHONY` for common
     targets (all/clean/test/install), recursive make smells, empty file,
     undefined-looking `$(VAR)` refs, duplicate targets, etc.
     Not an exploit guide.

## Example prompts

- "Which targets are marked .PHONY?"
- "Lite-lint this Makefile"
- "Does this Makefile mix spaces and tabs in recipes?"
