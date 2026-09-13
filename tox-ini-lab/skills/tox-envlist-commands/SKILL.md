---
name: tox-envlist-commands
description: >
  Parse tox.ini envlist (with simple factor expansion) and map per-testenv
  commands with the local zero-auth tox-ini-lab MCP. No tox binary, no network, no venv.
version: 1.0.0
tags: [tox, tox.ini, envlist, commands, python, developer-tools]
---

# Tox envlist & commands

When the user pastes **tox.ini** text and needs envlist inventory or command maps:

1. **`tox_envlist`** — `{ text }` → `{ envlist: string[], expanded?: string[], count }`.
   - Reads `[tox] envlist=`. Best-effort expand simple `py{310,311}` style factors.
2. **`tox_commands_map`** — `{ text }` → `{ envs:[{name, commands: string[]}], count }`.
   - From `[testenv]` / `[testenv:NAME]` `commands` / `commands_pre` / `commands_post`.

## Example prompts

- "What environments are in this tox.ini?"
- "Expand the envlist factors"
- "What commands does each tox env run?"
