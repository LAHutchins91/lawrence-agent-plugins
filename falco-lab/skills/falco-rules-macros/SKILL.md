---
name: falco-rules-macros
description: >
  Inventory Falco rules (name, priority, enabled) and extract macro / list
  hints with the local zero-auth falco-lab MCP. YAML string only — no falco
  CLI, kernel/eBPF, or network.
version: 1.0.0
tags: [falco, rules, macros, yaml, mcp, developer-tools]
---

# Falco rules & macros

When the user pastes a **Falco rules YAML** snippet:

1. **`falco_rules_list`** — `{ text }` → `{ rules: [{name?, priority?, enabled?}], count }`.
   - Looks for `- rule:`, `priority:`, `enabled:`.
2. **`falco_macros_hint`** — `{ text }` → `{ macros: string[], count }`.
   - Looks for `- macro:` names and `- list:` refs (`list:name`).

## Example prompts

- "Which Falco rules are in this YAML and what priority are they?"
- "List macros and lists defined in this rules file"
- "Is this rule enabled or disabled?"
