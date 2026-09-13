---
name: pyproject-deps
description: >
  Parse pasted pyproject.toml text locally with zero-auth MCP tools:
  list project dependencies (incl. optional extras), console/GUI scripts,
  and build-system backend. Lite TOML subset — not pip/poetry/uv. No network.
version: 1.0.0
tags: [pyproject, toml, python, parse, local]
---

# Pyproject deps

Use these tools when the user pastes pyproject.toml text (never fetch a remote file, never run pip/poetry/uv):

1. **`pyproject_deps_list`** with `toml` — → `{dependencies: [{name, extra?, spec?}]}`.
2. **`pyproject_scripts_list`** with `toml` — → `{scripts: [{name, entry}]}`.
3. **`pyproject_build_backend`** with `toml` — → `{requires[], buildBackend?}`.

Lite TOML subset parser. Input cap ~1MB. Documented limitations apply (not full TOML 1.0).

## Example prompts

- "List every dependency in this pyproject.toml."
- "What optional extras and scripts does this project declare?"
- "What build-backend does this pasted pyproject.toml use?"
