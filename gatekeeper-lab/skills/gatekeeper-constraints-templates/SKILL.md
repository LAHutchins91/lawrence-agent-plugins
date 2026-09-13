---
name: gatekeeper-constraints-templates
description: >
  Inventory Gatekeeper Constraints (kind, name, enforcementAction) and extract
  ConstraintTemplate hints (CRD kind, targets/rego presence) with the local
  zero-auth gatekeeper-lab MCP. YAML string only — no gatekeeper CLI, OPA, or network.
version: 1.0.0
tags: [gatekeeper, constraints, templates, k8s, mcp, developer-tools]
---

# Gatekeeper constraints & templates

When the user pastes a **Gatekeeper Constraint / ConstraintTemplate** snippet:

1. **`gatekeeper_constraints_list`** — `{ text }` → `{ constraints: [{kind?, name?, enforcementAction?}], count }`.
   - Looks for Constraint CRD kinds (`K8sRequiredLabels`, …), `metadata.name`, `spec.enforcementAction`.
2. **`gatekeeper_templates_hint`** — `{ text }` → `{ templates: [{name?, crdKind?, hasRego?}], count }`.
   - Looks for `kind: ConstraintTemplate`, `spec.crd.spec.names.kind`, and `targets[].rego` presence (not full Rego analysis).

## Example prompts

- "Which Gatekeeper constraints are in this YAML and what is enforcementAction?"
- "List ConstraintTemplates and their CRD kinds"
- "Does this template include Rego under targets?"
