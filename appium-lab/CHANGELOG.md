# Changelog

All notable changes to **appium-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ap_caps_list` for desiredCapabilities / capabilities key heuristics → `[{key, value?}]`.
- Add `ap_locators_hint` for `By.accessibilityId` / `accessibility id` / `-ios predicate` / `-android uiautomator` / `xpath` / `id` / `class name` / `MobileBy` / `findElement` / `findElements` / `$`` / `$$` usage counts → `[{method, count}]`.
- Add `ap_gestures_hint` for `touchAction` / `performActions` / `swipe` / `scroll` / `tap` / `longPress` / `dragAndDrop` / `multiTouch` usage counts → `[{method, count}]`.
- Add `ap_lint_lite` for hard_sleep, xpath_heavy, missing_platform, empty_file, and deprecated_touchaction.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Appium or launches a device/emulator/WebDriver. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
