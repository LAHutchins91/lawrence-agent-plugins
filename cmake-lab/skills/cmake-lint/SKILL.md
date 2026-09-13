---
name: cmake-lint
description: >
  Lite-lint pasted CMakeLists.txt for missing cmake_minimum_required,
  missing project(), duplicate target names, and outdated minimum version
  below 3.10. Local only, no cmake, no fetch.
version: 1.0.0
tags: [cmake, CMakeLists.txt, lint, local]
---

# CMake lint

Use **`cmake_lint_lite`** with `cmake` on pasted CMakeLists.txt (do not fetch URLs or run cmake):

- Missing `cmake_minimum_required(VERSION …)` (warning)
- Missing `project(…)` (warning)
- Duplicate `add_executable` / `add_library` target names (warning)
- `cmake_minimum_required` version older than 3.10 (info hint)

Heuristic only — not `cmake` configure / not cmake-lint. Lite CMake command scanner.

## Example prompts

- "Lint this CMakeLists.txt for missing cmake_minimum_required and project()."
- "Are there duplicate targets in this pasted CMake file?"
- "Is the cmake_minimum_required version outdated?"
