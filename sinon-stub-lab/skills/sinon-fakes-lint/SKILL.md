---
name: sinon-fakes-lint
description: >
  Extract Sinon fakes / fakeTimers / fakeServer / createSandbox hints and run
  educational heuristic lite lint on JS/TS text with the local zero-auth
  sinon-stub-lab MCP. No sinon runtime, no network.
version: 1.0.0
tags: [sinon, fake, timers, lint, developer-tools]
---

# Sinon fakes & lite lint

When the user wants fake/timers/sandbox inventory or a smell-check of pasted Sinon source:

1. **`sinon_fakes_hint`** — `{ text }` → `{ fakes: [{kind}], count }` for `sinon.fake`, `useFakeTimers`, `fakeServer`, `createSandbox`.
2. **`sinon_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, stub without restore/sandbox tip, calledOnce missing assert tip,
     fake timers without restore, etc. Not an exploit guide.

## Example prompts

- "What Sinon fakes / fake timers appear here?"
- "Lite-lint this Sinon test file"
- "Any stubs without restore or sandbox?"
