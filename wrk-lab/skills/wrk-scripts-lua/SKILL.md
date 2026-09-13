---
name: wrk-scripts-lua
description: >
  Extract wrk/wrk2 Lua hook function definitions (setup / init / request /
  response / done) and wrk.* API uses (wrk.method / wrk.headers / wrk.body /
  wrk.format) from Lua script text with the local zero-auth wrk-lab MCP.
  No wrk runtime, no network, no Lua VM.
version: 1.0.0
tags: [wrk, wrk2, lua, hooks, load-test, developer-tools]
---

# Wrk Lua scripts & APIs

When the user pastes **wrk / wrk2** Lua script source and needs hook / API inventory:

1. **`wrk_scripts_list`** — `{ text }` → `{ hooks: [{name}], count }` from `function setup|init|request|response|done(`.
2. **`wrk_lua_hint`** — `{ text }` → `{ wrkUses: [{api}], count }` from `wrk.method` / `wrk.headers` / `wrk.body` / `wrk.format` / etc.

## Example prompts

- "Which Lua hooks does this wrk script define?"
- "List wrk.method / wrk.headers uses in this script"
- "Does this script have a done() summary hook?"
