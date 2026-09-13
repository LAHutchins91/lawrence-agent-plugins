---
name: pyproject-lint
description: >
  Lite-lint pasted pyproject.toml for missing project name/version, missing
  build-system, dynamic version notes, open-ended dependencies (* / unpinned),
  and tool section presence notes. Local only, no pip/poetry/uv CLI, no fetch.
version: 1.0.0
tags: [pyproject, toml, python, lint, local]
---

# Pyproject lint

Use **`pyproject_lint_lite`** with `toml` on pasted pyproject.toml (do not fetch URLs or run pip/poetry/uv):

- Missing `[project]` name / version (error; version may be `dynamic`)
- Missing `[build-system]` (warning)
- Dynamic version note (info)
- Open-ended / unpinned deps and `*` (warning)
- `[tool.*]` section presence notes (info)

Heuristic only — not `pip check` / poetry check / uv. Lite TOML subset parser.

## Example prompts

- "Lint this pyproject.toml for missing version and open-ended deps."
- "Any dynamic version or missing build-system in this pasted pyproject.toml?"
- "Flag unpinned dependencies in this pyproject.toml."
