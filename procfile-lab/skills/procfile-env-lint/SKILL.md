---
name: procfile-env-lint
description: >
  Collect $VAR / ${VAR} env refs and run educational heuristic lite lint on
  Procfile text with the local zero-auth procfile-lab MCP. No network, no process spawn.
version: 1.0.0
tags: [procfile, heroku, env, lint, developer-tools]
---

# Procfile env refs & lite lint

When the user wants environment-variable inventory or a smell-check of pasted Procfile text:

1. **`procfile_env_refs`** — `{ text }` → `{ refs:[{name, process?, raw?}], unique, count }`.
2. **`procfile_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty file, missing web/worker (info), duplicate names, invalid
     name chars, bare `python` without `$PORT`, missing `$PORT` on web-like
     entries, tabs, etc. Not an exploit guide.

## Example prompts

- "Which env vars does this Procfile reference?"
- "Lite-lint this Procfile"
- "Does the web process bind to $PORT?"
