# Changelog

All notable changes to **playwright-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `pw_projects_list` for `projects: [{ name, use: { browserName / devices… } }]` → `{name, browserName?}`.
- Add `pw_browsers_list` for unique engines from projects / `use.browserName` / `devices['…']` → `[chromium|firefox|webkit|…]`.
- Add `pw_webserver_hint` for `webServer` object or array → `{command?, url?, reuseExistingServer?}`.
- Add `pw_lint_lite` for missing `baseURL` when `webServer` present, trace/screenshot off notes, no projects and no browserName, and `fullyParallel: false` with high workers.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no playwright binary. Lite JS/TS config scanner; ~1MB input cap. Document limits.
