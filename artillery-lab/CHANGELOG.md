# Changelog

All notable changes to **artillery-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `art_scenarios_list` for `scenarios:` / `scenario:` / `flow:` / `name:` → `[{name?, flowSteps?}]`.
- Add `art_phases_hint` for phases (`duration` / `arrivalRate` / `arrivalCount` / `rampTo` / `maxVusers` / `pause`) → `[{kind?, detail?}]`.
- Add `art_plugins_hint` for plugins/engines (`ensure` / `expect` / `metrics-by-endpoint` / `publish-metrics` / `apdex` / `playwright` / `socketio` / `ws`) → `[{name, count}]`.
- Add `art_lint_lite` for missing_phases, no_expect_ensure, high_arrival_no_max, empty_file, and target_http_insecure.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Artillery or executes load tests. Lite YAML/JS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
