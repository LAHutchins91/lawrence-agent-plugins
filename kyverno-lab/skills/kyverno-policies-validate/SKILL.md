---
name: kyverno-policies-validate
description: >
  Inventory Kyverno ClusterPolicy / Policy resources and extract validate
  rules (pattern / anyPattern / deny) with the local zero-auth kyverno-lab MCP.
  YAML string only — no kyverno CLI or network.
version: 1.0.0
tags: [kyverno, policies, validate, k8s, mcp, developer-tools]
---

# Kyverno policies & validate

When the user pastes a **Kyverno ClusterPolicy / Policy** snippet:

1. **`kyverno_policies_list`** — `{ text }` → `{ policies: [{name?, kind?, action?}], count }`.
   - Looks for `kind: ClusterPolicy` / `Policy`, `metadata.name`, `spec.validationFailureAction`.
2. **`kyverno_validate_hint`** — `{ text }` → `{ validates: [{name?, hasPattern?, hasDeny?}], count }`.
   - Looks for rules with `validate.pattern` / `anyPattern` / `deny` / `message`.

## Example prompts

- "Which Kyverno policies are in this YAML and what is validationFailureAction?"
- "List validate rules and whether they use pattern or deny"
- "Does this ClusterPolicy Enforce or Audit?"
