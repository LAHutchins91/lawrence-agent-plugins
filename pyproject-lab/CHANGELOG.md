# Changelog

All notable changes to **pyproject-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `pyproject_deps_list` for pyproject.toml text → `{name, extra?, spec?}` from `[project.dependencies]` / `[project.optional-dependencies]`.
- Add `pyproject_scripts_list` for `[project.scripts]` / `[project.gui-scripts]` → `{name, entry}`.
- Add `pyproject_build_backend` for `[build-system]` → `{requires[], buildBackend?}`.
- Add `pyproject_lint_lite` for missing project name/version, missing build-system, dynamic version notes, open-ended deps (`*` / unpinned), and tool section presence notes.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no pip/poetry/uv CLI. Lite TOML subset parser (not full TOML 1.0); ~1MB input cap. Document limits.
