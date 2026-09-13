---
name: arm-outputs-lint
description: "Extract Azure ARM template outputs and educational lite lint with the local zero-auth arm-template-lab MCP. No az CLI, deploy, or network."
version: 1.0.0
tags: [azure, arm, arm-template, outputs, lint, mcp, developer-tools]
---

# ARM outputs & lite lint

When the user pastes **ARM** template text or wants a smell-check:

1. **`arm_outputs_hint`** — `{ text }` → `{ outputs: [{name, type?}], count }`.
2. **`arm_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `$schema` / `contentVersion`, plaintext secrets
     in variables, wildcard `*` actions in roleAssignments tip, missing apiVersion.
   - Not an exploit guide.

## Example prompts

- "What outputs does this ARM template declare?"
- "Lint this azuredeploy.json for missing $schema or apiVersion"
- "Any plaintext secrets in variables or wildcard role actions tips?"
