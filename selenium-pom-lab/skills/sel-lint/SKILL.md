---
name: sel-lint
description: "Count Selenium WebDriverWait / until / ExpectedConditions / implicitlyWait / sleep / Thread.sleep / setTimeout wait hints and lite-lint for hard sleeps, XPath-heavy locators, missing waits, empty file, and implicit-wait-only. Local only, never runs Selenium/WebDriver, no fetch."
version: 1.0.0
tags: [selenium, pom, lint, local]
---

# Selenium waits & lite lint

Use these tools on pasted Selenium POM JS/TS (do not fetch URLs or run Selenium/WebDriver):

1. **`sel_waits_hint`** with `source` — → `{waits: [{method, count}], count}`.
2. **`sel_lint_lite`** with `source` — findings:
   - Hard sleep / Thread.sleep / driver.sleep (warning)
   - XPath-heavy vs By.id/By.css (info/warning)
   - Missing wait near findElement/click (warning)
   - Empty file (warning)
   - Implicit wait only (info)

Heuristic only — not the Selenium WebDriver runtime. Lite JS/TS scanner.

## Example prompts

- "Any hard sleep / Thread.sleep calls?"
- "Does this file use WebDriverWait near findElement?"
- "Lint this Selenium POM for XPath-heavy or implicit-only waits."
