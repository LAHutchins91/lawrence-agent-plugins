# Changelog

All notable changes to **fortio-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ft_targets_list` for fortio load / fortio curl / fortio echo, -url, http(s):// → `[{url?, mode?}]`.
- Add `ft_qps_hint` for QPS/load flags (`-qps` / `-c` / `-t` / `-n` / `-r` / `-p` / `-H` / `-payload` / `-keepalive` / `-a`) → `[{method, count}]`.
- Add `ft_percentiles_hint` for percentile/histogram fields (`-json` / `-p` / `Percentile` / `p50` / `p75` / `p90` / `p99` / `p999` / `histogram` / `All done`) → `[{method, count}]`.
- Add `ft_lint_lite` for missing_qps_or_n, high_c_no_qps, http_target, empty_file, and no_duration.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Fortio or executes load tests. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
