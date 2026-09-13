# Changelog

All notable changes to **cmake-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `cmake_targets_list` for `add_executable` / `add_library` → `{name, kind}` (executable|library|static|shared|interface|object|module|alias).
- Add `cmake_find_package_list` for `find_package(...)` → `{name, version?, required?, components?}`.
- Add `cmake_options_list` for `option(NAME "desc" ON/OFF)` → `{name, description?, default?}`.
- Add `cmake_lint_lite` for missing `cmake_minimum_required`, missing `project()`, duplicate target names, and outdated minimum &lt; 3.10 hint.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no cmake binary. Lite CMake command scanner; ~1MB input cap. Document limits.
