---
name: pw-lint
description: "Lite-lint pasted playwright.config.* for missing baseURL when webServer is present, trace/screenshot off notes, no projects and no browserName, and fullyParallel false with high workers. Local only, no playwright binary, no fetch."
version: 1.0.0
tags: [playwright, playwright.config, lint, webServer, local]
---

# Playwright lint

Use **`pw_lint_lite`** with `configText` on pasted playwright config (do not fetch URLs or run playwright):

- Missing `use.baseURL` when `webServer` is present (warning)
- `trace: 'off'` / unset and `screenshot: 'off'` notes (info)
- No `projects` and no `browserName` / devices hints (warning)
- `fullyParallel: false` with high `workers` (warning)

Heuristic only — not Playwright CLI / not a full AST. Lite JS/TS config scanner.

## Example prompts

- "Lint this playwright.config.ts for missing baseURL with webServer."
- "Is trace off in this pasted Playwright config?"
- "Does this config declare projects or only default chromium?"
