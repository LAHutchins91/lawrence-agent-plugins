# Changelog

All notable changes to **jsonlint-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `jsonlint_modes_list` for modes from pasted CLI/config (`compact` / `pretty` / `validate` / `quiet`) → `[{name?}]`.
- Add `jsonlint_options_hint` for `--compact` / `--in-place` / `--quiet` / `--indent` / `--validate` / `-c` / `-i` / `-q` → `[{method, count}]`.
- Add `jsonlint_sort_hint` for `--sort-keys` / `sortKeys` / `sorted` / `key order` → `[{method, count}]`.
- Add `jsonlint_lint_lite` for trailing_comma, single_quotes, empty_file, duplicate_keys_heuristic, and comments_in_json.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs jsonlint CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
