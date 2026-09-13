---
name: pw-lint
description: >
  Count Playwright test.extend / test.beforeEach / test.afterEach /
  test.describe / expect( fixture hints and lite-lint for hard waits,
  CSS-heavy selectors, missing await, empty file, and networkidle waits.
  Local only, never runs Playwright/browser, no fetch.
version: 1.0.0
tags: [playwright, pom, lint, local]
---

# Playwright fixtures & lite lint

Use these tools on pasted Playwright POM JS/TS (do not fetch URLs or run Playwright/browser):

1. **`pw_fixtures_hint`** with `source` — → `{fixtures: [{method, count}], count}`.
2. **`pw_lint_lite`** with `source` — findings:
   - Hard wait / waitForTimeout (warning)
   - CSS-selector heavy vs getBy* (info/warning)
   - Missing await on click/fill/goto (warning)
   - Empty file (warning)
   - networkidle wait (info)

Heuristic only — not the Playwright test runtime. Lite JS/TS scanner.

## Example prompts

- "Any waitForTimeout hard waits?"
- "Does this file await page.goto / click / fill?"
- "Lint this Playwright POM for flaky networkidle or CSS selectors."
