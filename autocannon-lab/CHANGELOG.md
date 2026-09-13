# Changelog

All notable changes to **autocannon-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ac_targets_list` for `autocannon(` / `autocannon.track(` / `url:` / `title:` → `[{url?, title?}]`.
- Add `ac_options_hint` for options (`connections` / `duration` / `amount` / `pipelining` / `workers` / `timeout` / `headers` / `method` / `body` / `bailout` / `overallRate`) → `[{method, count}]`.
- Add `ac_metrics_hint` for metrics/handlers (`latency` / `requests` / `throughput` / `errors` / `timeouts` / `non2xx` / `2xx` / `statusCodeStats` / `on('done'` / `.then(result`) → `[{method, count}]`.
- Add `ac_lint_lite` for missing_duration_amount, high_connections, http_target, empty_file, and no_result_handler.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs autocannon or executes load tests. Lite JS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
