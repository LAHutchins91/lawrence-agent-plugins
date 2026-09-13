---
name: ppol-policies
description: "List Pulumi Policy as Code PolicyPack / policies array names (name + kind) and rule method counts (validateResource / validateStack / ResourceValidationPolicy / StackValidationPolicy / enforcementLevel / advisory / mandatory) from pasted TS/JS/Python. Local only — never runs Pulumi CLI, no fetch."
version: 1.0.0
tags: [pulumi, policy, policy-as-code, policies, rules, local]
---

# Pulumi Policy policies & rules

Use these tools when the user pastes Pulumi Policy as Code text (never fetch a remote file, never run Pulumi CLI):

1. **`ppol_policies_list`** with `source` — → `{policies: [{name?, kind?}], count}`.
2. **`ppol_rules_hint`** with `source` — → `{rules: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not Pulumi CLI; no network).

## Example prompts

- "Which policies are defined in this PolicyPack?"
- "How many validateResource vs validateStack rules?"
- "List policy names and kinds from this paste."
