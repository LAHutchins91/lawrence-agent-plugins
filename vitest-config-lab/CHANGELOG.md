# Changelog

All notable changes to **vitest-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `vitest_include_patterns` for `test.include` / `test.exclude` globs → `{include[], exclude[]}`.
- Add `vitest_coverage_summary` for `coverage.provider` / `reporter|reporters` / `thresholds` → `{provider?, reporters[], thresholds?, present}`.
- Add `vitest_workspace_projects` for `defineWorkspace` / `test.projects` / workspace arrays → `{nameOrPath}`.
- Add `vitest_lint_lite` for missing `test.environment`, coverage without thresholds, globals-only setup notes, and empty include.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no vitest/vite binary. Lite JS/TS config scanner; ~1MB input cap. Document limits.
