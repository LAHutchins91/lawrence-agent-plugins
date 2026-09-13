# Changelog

All notable changes to **hey-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `hey_targets_list` for hey ... https://... / -m METHOD / trailing URL args → `[{url?, method?}]`.
- Add `hey_options_hint` for option flags (`-n` / `-c` / `-q` / `-z` / `-t` / `-m` / `-H` / `-D` / `-d` / `-T` / `-a` / `-x` / `-h2` / `-disable-keepalive`) → `[{method, count}]`.
- Add `hey_output_hint` for output/summary fields (`-o` / `-csv` / `summary` / `latency` / `Requests/sec` / `Status code distribution`) → `[{method, count}]`.
- Add `hey_lint_lite` for missing_n_or_z, high_c_low_n, http_target, empty_file, and no_concurrency.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs hey or executes load tests. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
