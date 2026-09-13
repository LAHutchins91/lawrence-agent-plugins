# Changelog

All notable changes to **ab-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ab_targets_list` for ab ... http(s)://... / -p POST body file implying POST → `[{url?, method?}]`.
- Add `ab_options_hint` for option flags (`-n` / `-c` / `-t` / `-p` / `-T` / `-H` / `-A` / `-P` / `-X` / `-k` / `-g` / `-e` / `-r` / `-s` / `-w`) → `[{method, count}]`.
- Add `ab_concurrency_hint` for concurrency/summary fields (`-n` / `-c` / `-t` / `-k` / `Requests per second` / `Time per request`) → `[{method, count}]`.
- Add `ab_lint_lite` for missing_n_or_t, high_c_low_n, http_target, empty_file, and no_keepalive.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs ab or executes load tests. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
