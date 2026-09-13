---
name: terrascan-policies-scans
description: >
  Inventory Terrascan policy IDs / categories and extract scan targets
  (iac-type, dirs, skip-rules) with the local zero-auth terrascan-lab MCP.
  YAML/JSON/TOML-ish string only — no terrascan CLI or network.
version: 1.0.0
tags: [terrascan, iac, policy, scan, mcp, developer-tools]
---

# Terrascan policies & scans

When the user pastes **Terrascan** config, policy lists, or scan settings:

1. **`terrascan_policies_list`** — `{ text }` → `{ policies: [{id?, category?, severity?}], count }`.
   - Looks for policy / rule IDs (`AC_AWS_*`, `AWS.*`, …) and categories.
2. **`terrascan_scans_hint`** — `{ text }` → `{ iacTypes, skipRules?, dirs?, count }`.
   - Looks for `iac-type` (terraform / k8s / helm / …), skip-rules, and scan dirs.

## Example prompts

- "Which Terrascan policy IDs are in this config?"
- "What iac-type and skip-rules does this terrascan scan use?"
- "Inventory policies and scan targets from this paste"
