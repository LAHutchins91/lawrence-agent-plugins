# Changelog

All notable changes to **vegeta-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `veg_targets_list` for GET/POST/PUT/DELETE lines / NewStaticTargeter / Method/URL → `[{method?, url?}]`.
- Add `veg_rates_hint` for rate/pacer/attack flags (`Rate` / `ConstantPacer` / `ConstantArrivalRate` / `-rate` / `-duration` / `-connections` / `-workers` / `-timeout` / `attack`) → `[{method, count}]`.
- Add `veg_reports_hint` for report/encode/plot APIs (`report` / `encode` / `NewDecoder` / `NewEncoder` / `-output` / `plot` / `hdrplot` / `json` / `hist`) → `[{method, count}]`.
- Add `veg_lint_lite` for missing_rate, missing_duration, http_target, empty_file, and no_report.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Vegeta or executes load tests. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
