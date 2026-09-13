---
name: polaris-checks-exemptions
description: >
  Inventory Fairwinds Polaris checks (id / enabled / severity) and extract
  exemptions / namespace ignore hints with the local zero-auth polaris-lab MCP.
  YAML string only — no polaris CLI or network.
version: 1.0.0
tags: [polaris, fairwinds, checks, exemptions, k8s, mcp, developer-tools]
---

# Polaris checks & exemptions

When the user pastes a **Polaris config** snippet:

1. **`polaris_checks_list`** — `{ text }` → `{ checks: [{id?, enabled?, severity?}], count }`.
   - Looks for `checks:` map (`checkId: danger|warning|ignore`) and `customChecks`.
2. **`polaris_exemptions_hint`** — `{ text }` → `{ exemptions: [{namespace?, controllerName?, rules?}], count }`.
   - Looks for `exemptions` / ignore / namespace exemptions with controllerNames + rules.

## Example prompts

- "Which Polaris checks are in this config and at what severity?"
- "What exemptions / namespaces are ignored in this Polaris YAML?"
- "Inventory check ids that are set to ignore"
