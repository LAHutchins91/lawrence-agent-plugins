---
name: opa-packages
description: "List OPA/Rego package declarations (name) and rule method counts (rule_heads / allow / deny / violation / default / import) from pasted Rego. Local only — never runs OPA CLI, no fetch."
version: 1.0.0
tags: [opa, rego, policy, packages, rules, local]
---

# OPA packages & rules

Use these tools when the user pastes Rego policy text (never fetch a remote file, never run OPA CLI):

1. **`opa_packages_list`** with `source` — → `{packages: [{name?}], count}`.
2. **`opa_rules_hint`** with `source` — → `{rules: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not OPA CLI; no network).

## Example prompts

- "Which packages are declared in this Rego?"
- "How many allow vs deny vs violation rules?"
- "List package names from this paste."
