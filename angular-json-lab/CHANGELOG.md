# Changelog

All notable changes to **angular-json-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ng_projects_list` for `projects` → `{name, projectType?, root?, sourceRoot?}`.
- Add `ng_architect_targets` for architect/targets → `{project, target, builder?}` (optional project filter).
- Add `ng_styles_scripts` for build options `styles` / `scripts` arrays.
- Add `ng_lint_lite` for missing `defaultProject` (legacy), no projects, builder version-ish notes, and budgets missing on production config.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no ng binary for tool logic. JSON-only angular.json scanner (same-shape project.json accepted); ~1MB input cap. Document limits. FREE MIT.
