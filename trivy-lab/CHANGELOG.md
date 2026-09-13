# Changelog

All notable changes to **trivy-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `trivy_scans_list` for image / fs / repo / config / sbom / kubernetes / vuln scans from pasted config/CI → `[{kind?, target?}]`.
- Add `trivy_ignores_hint` for trivyignore / trivy_ignore / ignorefile / ignorefile_flag / cve → `[{method, count}]`.
- Add `trivy_severity_hint` for critical / high / medium / low / unknown / severity_flag / severity_key → `[{method, count}]`.
- Add `trivy_lint_lite` for ignore_without_expiry, broad_ignore_all, empty_file, exit_code_zero, and severity_critical_only.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs trivy CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
