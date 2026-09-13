---
name: tox-deps-lint
description: >
  List tox.ini deps across testenvs and run educational heuristic lite lint
  with the local zero-auth tox-ini-lab MCP. No tox binary, no network, no venv.
version: 1.0.0
tags: [tox, tox.ini, deps, lint, python, developer-tools]
---

# Tox deps & lite lint

When the user wants dependency inventory or a smell-check of pasted tox.ini text:

1. **`tox_deps_list`** — `{ text }` → `{ deps:[{env?, package}], unique: string[], count }`.
   - From `deps =` lines across `[testenv]` / `[testenv:NAME]`.
2. **`tox_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty file, missing `[tox]`/`envlist`, `skip_missing_interpreters`
     tips, `usedevelop` vs `package`, `passenv` secret smells, empty commands,
     duplicate env sections, etc. Not an exploit guide.

## Example prompts

- "What deps does this tox.ini pull in?"
- "Lite-lint this tox.ini"
- "Are there passenv secret smells?"
