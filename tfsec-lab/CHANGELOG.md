# Changelog

All notable changes to **tfsec-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `tfsec_checks_list` for AWS006 / AVD- / tfsec check IDs from pasted HCL/config/comments → `[{id?}]`.
- Add `tfsec_ignores_hint` for tfsec_ignore / hash_tfsec_ignore / exclude / exclude_flag → `[{method, count}]`.
- Add `tfsec_severity_hint` for critical / high / medium / low / minimum_severity / soft_fail → `[{method, count}]`.
- Add `tfsec_lint_lite` for ignore_without_reason, broad_exclude, empty_file, soft_fail_only, and minimum_severity_high.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs tfsec CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
