---
name: eslint-extends-rules
description: >
  List extends and summarize rule severities from ESLint config text
  with the local zero-auth eslint-config-lab MCP. JSONC preferred;
  YAML/JS heuristics; no eslint binary or network.
version: 1.0.0
tags: [eslint, eslint-config, extends, rules, developer-tools]
---

# ESLint extends & rules summary

When the user pastes **ESLint config** (`.eslintrc*`, YAML, or JS) and needs extends inventory or rules severity tallies:

1. **`eslint_extends_list`** — `{ text }` → `{ extends, count }`.
   - JSONC / YAML / JS-heuristic extraction of `extends` string or array.
2. **`eslint_rules_summary`** — `{ text }` → `{ rules:[{id,severity}], counts, total }`.
   - Maps `0|1|2` and `off|warn|error` (arrays use first element).

## Example prompts

- "What does this eslintrc extend?"
- "Summarize rule severities in this config"
- "How many rules are error vs warn vs off?"
