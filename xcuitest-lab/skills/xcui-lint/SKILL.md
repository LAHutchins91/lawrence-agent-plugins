---
name: xcui-lint
description: >
  Count XCUITest XCTAssert / XCTAssertEqual / XCTAssertTrue /
  waitForExistence / expectation / XCTNSPredicateExpectation /
  XCTWaiter / exists / isHittable expectation hints and lite-lint for
  hard sleeps, missing waitForExistence around tap, label/staticTexts-
  heavy usage, empty file, and force unwrap after query subscripts.
  Local only, never runs XCUITest/Xcode/simulator, no fetch.
version: 1.0.0
tags: [xcuitest, ios, lint, local]
---

# XCUITest expectations & lite lint

Use these tools on pasted XCUITest Swift/ObjC-ish source (do not fetch URLs or run XCUITest/Xcode/simulator):

1. **`xcui_expectations_hint`** with `source` — → `{expectations: [{method, count}], count}`.
2. **`xcui_lint_lite`** with `source` — findings:
   - Hard sleep / Thread.sleep / usleep (warning)
   - tap without nearby waitForExistence/XCTWaiter (warning)
   - Many staticTexts/label vs identifier (info/warning)
   - Empty file (warning)
   - Force unwrap after query subscripts (info/warning)

Heuristic only — not XCTest/XCUITest runtime or Xcode. Lite Swift/ObjC-ish scanner.

## Example prompts

- "Any hard sleep / Thread.sleep calls?"
- "Are taps guarded by waitForExistence?"
- "Lint this XCUITest file for label-query-heavy or force unwraps."
