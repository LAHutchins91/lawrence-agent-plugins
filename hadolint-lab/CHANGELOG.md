# Changelog

All notable changes to **hadolint-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `hadolint_rules_list` for DL/SC rule ids from pasted Dockerfile/config/comments (`DL3008`, `SC2086`, etc.) → `[{id?}]`.
- Add `hadolint_ignores_hint` for `ignore=` / `--ignore` / `ignored:` / `trustedRegistries` → `[{method, count}]`.
- Add `hadolint_config_hint` for `.hadolint.yaml` / `failure-threshold` / `override` / `label-schema` / `strict-labels` / `format` → `[{method, count}]`.
- Add `hadolint_lint_lite` for latest_tag, apt_without_no_install_recommends, ignore_without_reason, empty_file, and broad_ignore.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs hadolint CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
