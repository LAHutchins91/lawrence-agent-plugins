# Changelog

All notable changes to **checkov-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ckv_checks_list` for CKV_ / CKV2_ check IDs from pasted config/code/comments → `[{id?}]`.
- Add `ckv_frameworks_hint` for terraform / cloudformation / kubernetes / dockerfile / secrets / arm / bicep / helm / github_actions → `[{method, count}]`.
- Add `ckv_skips_hint` for checkov_skip / skip_check / soft_fail / quiet / compact / skip_check_flag → `[{method, count}]`.
- Add `ckv_lint_lite` for skip_without_reason, broad_skip_all, empty_file, soft_fail_only, and missing_framework.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs checkov CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
