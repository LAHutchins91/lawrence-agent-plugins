# Changelog

All notable changes to **playwright-pom-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `pw_pages_list` for Page/POM class and `export const *Page` heuristics → `[{name?, kind}]`.
- Add `pw_locators_hint` for `getByRole` / `getByText` / `getByTestId` / `getByLabel` / `getByPlaceholder` / `.locator(` / `page.locator` usage counts → `[{method, count}]`.
- Add `pw_fixtures_hint` for `test.extend` / `test.beforeEach` / `test.afterEach` / `test.describe` / `expect(` usage counts → `[{method, count}]`.
- Add `pw_lint_lite` for hard_wait, css_selector_heavy, missing_await, empty_file, and networkidle_wait.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Playwright or launches a browser. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
