---
name: td-replacements-when
description: >
  Extract testdouble.js replacements and td.when stubs from JS/TS text with the
  local zero-auth testdouble-lab MCP. No testdouble runtime, no network.
version: 1.0.0
tags: [testdouble, td, replace, when, developer-tools]
---

# Testdouble replacements & when

When the user pastes **testdouble.js** test source and needs replacement / when inventory:

1. **`td_replacements_list`** — `{ text }` → `{ replacements: [{module?, name?}], count }` from `td.replace(` / `td.replaceEsm(`.
2. **`td_when_hint`** — `{ text }` → `{ whens: [{call?, then?}], count }` from `td.when(...).thenReturn/thenResolve/thenReject/thenCallback`.

## Example prompts

- "List td.replace modules in this test"
- "What td.when stubs are configured here?"
- "Any replaceEsm calls?"
