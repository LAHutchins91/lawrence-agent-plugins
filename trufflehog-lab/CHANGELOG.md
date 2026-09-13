# Changelog

All notable changes to **trufflehog-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `trufflehog_detectors_list` for detector names from pasted TruffleHog config/CI (`--include-detectors`, `detectors:`, `detector:`) → `[{name?}]`.
- Add `trufflehog_filters_hint` for exclude-paths / exclude-detectors / filter-entropy / include-paths / `--exclude-paths` → `[{method, count}]`.
- Add `trufflehog_config_hint` for `--json` / `--only-verified` / `--results` / git / github / filesystem / s3 / `--concurrency` → `[{method, count}]`.
- Add `trufflehog_lint_lite` for no_verified_flag, exclude_all_detectors, empty_file, json_without_fail, and filesystem_without_exclude.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs trufflehog CLI, never returns secret values. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
