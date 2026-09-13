# Changelog

All notable changes to **selenium-pom-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `sel_pages_list` for Page/POM class and `export const *Page` heuristics → `[{name?, kind}]`.
- Add `sel_locators_hint` for `By.id` / `By.css` / `By.xpath` / `By.name` / `By.className` / `By.linkText` / `By.partialLinkText` / `By.tagName` / `findElement` / `findElements` usage counts → `[{method, count}]`.
- Add `sel_waits_hint` for `WebDriverWait` / `until` / `ExpectedConditions` / `implicitlyWait` / `sleep` / `Thread.sleep` / `setTimeout` / `driver.sleep` usage counts → `[{method, count}]`.
- Add `sel_lint_lite` for hard_sleep, xpath_heavy, missing_wait, empty_file, and implicit_wait_only.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Selenium or launches a WebDriver/browser. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
