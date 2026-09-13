# Changelog

All notable changes to **detox-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `dx_matchers_list` for `by.id` / `by.text` / `by.label` / `by.type` / `by.traits` / `element(by.` call-site heuristics → `[{method, arg?}]`.
- Add `dx_actions_hint` for `tap` / `longPress` / `multiTap` / `typeText` / `replaceText` / `clearText` / `scroll` / `scrollTo` / `swipe` / `setColumnToValue` / `setDatePickerDate` usage counts → `[{method, count}]`.
- Add `dx_sync_hint` for `waitFor` / `whileElement` / `withTimeout` / `toBeVisible` / `toExist` / `toHaveText` / `toHaveValue` / `detox.device.reloadReactNative` / `device.launchApp` usage counts → `[{method, count}]`.
- Add `dx_lint_lite` for hard_sleep, missing_waitfor, text_matcher_heavy, empty_file, and reload_in_test.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Detox or launches a device/emulator. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
