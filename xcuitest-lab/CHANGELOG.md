# Changelog

All notable changes to **xcuitest-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `xcui_queries_list` for `buttons` / `staticTexts` / `textFields` / `otherElements` / `cells` / `tables` / `navigationBars` / `element(matching:)` / `descendants(matching:)` / `identifier` / `label` / `value` call-site heuristics → `[{method, arg?}]`.
- Add `xcui_actions_hint` for `tap` / `doubleTap` / `press` / `swipeLeft` / `swipeRight` / `swipeUp` / `swipeDown` / `typeText` / `clearText` / `adjustToPickerWheelValue` / `pinch` / `rotate` usage counts → `[{method, count}]`.
- Add `xcui_expectations_hint` for `XCTAssert` / `XCTAssertEqual` / `XCTAssertTrue` / `waitForExistence` / `expectation` / `XCTNSPredicateExpectation` / `XCTWaiter` / `exists` / `isHittable` usage counts → `[{method, count}]`.
- Add `xcui_lint_lite` for hard_sleep, missing_wait, label_query_heavy, empty_file, and force_unwrap_element.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs XCUITest or launches Xcode/simulator. Lite Swift/ObjC-ish scanner; ~1MB input cap. Document scanner limits. FREE MIT.
