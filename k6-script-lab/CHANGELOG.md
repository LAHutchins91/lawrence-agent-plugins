# Changelog

All notable changes to **k6-script-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `k6_scenarios_list` for `scenarios{}` keys and executor types (`constant-vus` / `ramping-vus` / `per-vu-iterations` / `shared-iterations` / `constant-arrival-rate` / `ramping-arrival-rate` / `externally-controlled`) → `[{name?, executor?}]`.
- Add `k6_checks_hint` for `check` / `group` / `fail` / `http.get` / `http.post` / `http.put` / `http.del` / `http.request` usage counts → `[{method, count}]`.
- Add `k6_thresholds_hint` for `thresholds{}` (`http_req_duration` / `http_req_failed` / `checks` / custom Rate/Trend/Counter) → `[{metric?, expr?}]`.
- Add `k6_lint_lite` for missing_thresholds, sleep_only_pacing, no_checks, empty_file, and insecure_tls.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs k6 or executes load tests. Lite JS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
