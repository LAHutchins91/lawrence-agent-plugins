# Changelog

All notable changes to **grype-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `grype_scans_list` for dir / image / sbom / file / docker scans from pasted config/CI → `[{kind?, target?}]`.
- Add `grype_ignores_hint` for grype_yaml / ignore / vex / exclude / cve → `[{method, count}]`.
- Add `grype_severity_hint` for critical / high / medium / low / negligible / unknown / fail_on / fail_on_key → `[{method, count}]`.
- Add `grype_lint_lite` for ignore_without_reason, broad_exclude, empty_file, no_fail_on, and fail_on_critical_only.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs grype CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
