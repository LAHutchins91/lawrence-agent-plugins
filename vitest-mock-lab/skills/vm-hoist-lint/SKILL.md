---
name: vm-hoist-lint
description: >
  Extract Vitest vi.hoisted / doMock / unmock / resetModules hints and run
  educational heuristic lite lint on JS/TS text with the local zero-auth
  vitest-mock-lab MCP. No vitest runtime, no network.
version: 1.0.0
tags: [vitest, hoist, mock, lint, developer-tools]
---

# Vitest hoist & lite lint

When the user wants hoist/doMock inventory or a smell-check of pasted Vitest mock source:

1. **`vm_hoist_hint`** — `{ text }` → `{ hoisted: [{kind}], count }` for `vi.hoisted`, `vi.doMock`, `vi.unmock`, `vi.resetModules`.
2. **`vm_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, mock without clearAllMocks tip, spy without mockRestore,
     import order vs hoist tip, etc. Not an exploit guide.

## Example prompts

- "What vi.hoisted / doMock / unmock appear here?"
- "Lite-lint this Vitest mock setup"
- "Any mocks without clearAllMocks or spies without mockRestore?"
