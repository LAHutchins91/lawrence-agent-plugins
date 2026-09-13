---
name: salt-states-pillars
description: >
  Inventory Salt SLS state IDs and modules (pkg.installed, service.running,
  file.managed, etc.) and extract pillar keys (flagging secret/password/token
  key names) with the local zero-auth salt-lab MCP. YAML/string only — no salt
  CLI, minion/master, or network.
version: 1.0.0
tags: [salt, saltstack, sls, pillar, states, mcp, developer-tools]
---

# Salt states & pillars

When the user pastes **Salt** SLS or pillar YAML:

1. **`salt_states_list`** — `{ text }` → `{ states: [{id?, module?, fun?}], count }`.
2. **`salt_pillars_hint`** — `{ text }` → `{ pillars: string[], secretKeyNames?, count }`.
   - Looks for pillar YAML keys, `{% pillar %}` / `pillar.get` / `salt['pillar.get']`.

## Example prompts

- "List the state IDs and modules in this SLS"
- "What pillar keys does this file declare?"
- "Any secret-looking pillar key names in this paste?"
