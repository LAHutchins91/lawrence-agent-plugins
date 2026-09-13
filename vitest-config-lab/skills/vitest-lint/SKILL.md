---
name: vitest-lint
description: "Lite-lint pasted vitest.config.*/vite.config.* for missing test.environment, coverage without thresholds, globals-only setup notes, and empty include. Local only, no vitest/vite binary, no fetch."
version: 1.0.0
tags: [vitest, vite, vitest.config, lint, coverage, local]
---

# Vitest lint

Use **`vitest_lint_lite`** with `configText` on pasted vitest/vite config (do not fetch URLs or run vitest/vite):

- Missing `test.environment` (info) — Vitest defaults to `node`
- `coverage` present without `thresholds` (warning)
- `globals: true` setup notes (info) — prefer explicit imports from `vitest`
- Empty `include` array (warning)

Heuristic only — not vitest CLI / not a full AST. Lite JS/TS config scanner.

## Example prompts

- "Lint this vitest.config.ts for missing environment and coverage thresholds."
- "Is globals-only setup risky in this pasted config?"
- "Does this config have an empty include?"
