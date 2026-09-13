---
name: jm-lint
description: >
  Count Jest jest.useFakeTimers( / advanceTimersByTime( / runAllTimers(
  timer hints and lite-lint for mock without clearAllMocks/restoreAllMocks,
  spy without mockRestore, empty file, and requireActual missing when
  partial mock. Local only, never runs Jest, no fetch.
version: 1.0.0
tags: [jest, mock, lint, local]
---

# Jest timers & lite lint

Use these tools on pasted Jest mock JS/TS (do not fetch URLs or run Jest):

1. **`jm_timers_hint`** with `source` — → `{timers: [{method, count}], count}`.
2. **`jm_lint_lite`** with `source` — findings:
   - Mock without clearAllMocks/restoreAllMocks (warning)
   - Spy without mockRestore (warning)
   - requireActual missing when partial mock (warning)
   - Empty file (warning)

Heuristic only — not the Jest test runtime. Lite JS/TS scanner.

## Example prompts

- "Does this file use fake timers?"
- "Any jest.mock without clearAllMocks?"
- "Lint this Jest mock usage for missing mockRestore or requireActual."
