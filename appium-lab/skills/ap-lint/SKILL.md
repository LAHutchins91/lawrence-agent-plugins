---
name: ap-lint
description: >
  Count Appium touchAction / performActions / swipe / scroll / tap /
  longPress / dragAndDrop / multiTouch gesture hints and lite-lint for
  hard sleeps, XPath-heavy locators, missing platformName, empty file,
  and deprecated touchAction. Local only, never runs Appium/device,
  no fetch.
version: 1.0.0
tags: [appium, mobile, lint, local]
---

# Appium gestures & lite lint

Use these tools on pasted Appium JS/TS (do not fetch URLs or run Appium/device/WebDriver):

1. **`ap_gestures_hint`** with `source` — → `{gestures: [{method, count}], count}`.
2. **`ap_lint_lite`** with `source` — findings:
   - Hard sleep / browser.pause / driver.pause (warning)
   - XPath-heavy vs accessibilityId/id (warning)
   - Missing platformName in caps (warning)
   - Empty file (warning)
   - Deprecated touchAction (info)

Heuristic only — not the Appium server or WebDriverIO runtime. Lite JS/TS scanner.

## Example prompts

- "Any hard sleep / browser.pause calls?"
- "Does this caps object include platformName?"
- "Lint this Appium file for xpath-heavy or touchAction usage."
