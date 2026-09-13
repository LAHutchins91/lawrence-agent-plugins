---
name: kube-linter-checks-config
description: >
  Inventory kube-linter checks / customChecks and extract checks.add/exclude /
  doNotAutoAddDefaults with the local zero-auth kube-linter-lab MCP.
  YAML string only — no kube-linter CLI or network.
version: 1.0.0
tags: [kube-linter, kubernetes, k8s, config, mcp, developer-tools]
---

# Kube-linter checks & config

When the user pastes a **`.kube-linter.yaml`** (or customChecks) snippet:

1. **`kube_linter_checks_list`** — `{ text }` → `{ checks: [{name?, enabled?, template?}], count }`.
   - Looks for `checks.add` / `exclude` / `include` and `customChecks` (name + template).
2. **`kube_linter_config_hint`** — `{ text }` → `{ add?, exclude?, customCount? }`.
   - Looks for `checks.add` / `exclude`, `customChecks` count, `doNotAutoAddDefaults`.

## Example prompts

- "Which kube-linter checks are in this .kube-linter.yaml?"
- "What does checks.add / exclude look like in this config?"
- "Inventory customChecks templates from this paste"
