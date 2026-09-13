---
name: falco-outputs-lint
description: >
  Check Falco rule output / condition presence and run educational lite lint
  with the local zero-auth falco-lab MCP. No falco CLI, kernel/eBPF, or
  network. Educational rules-structure tips only — not an exploit or evasion guide.
version: 1.0.0
tags: [falco, outputs, lint, yaml, mcp, developer-tools]
---

# Falco outputs & lite lint

When the user pastes Falco rules and wants structure / smell checks:

1. **`falco_outputs_hint`** — `{ text }` → `{ outputs: [{rule?, hasCondition?, hasOutput?}], count }`.
   - Structure only: whether `condition:` / `output:` are present (do not teach evasion).
2. **`falco_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing rule name, disabled-all tip, overly broad condition.
   - Not an exploit or evasion guide.

## Example prompts

- "Which rules have both condition and output fields?"
- "Lint this Falco rules snippet for missing names or disabled-all"
- "Does any rule look overly broad at the structure level?"
