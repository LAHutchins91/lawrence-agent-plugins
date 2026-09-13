---
name: tflint-rules-plugins
description: >
  Inventory TFLint rule blocks (name, enabled) and extract plugin name/source/version
  hints with the local zero-auth tflint-lab MCP. String/regex only — no tflint CLI,
  terraform, or network.
version: 1.0.0
tags: [tflint, terraform, hcl, rules, plugins, mcp, developer-tools]
---

# TFLint rules & plugins

When the user pastes **TFLint** HCL (`.tflint.hcl` / …):

1. **`tflint_rules_list`** — `{ text }` → `{ rules: [{name?, enabled?}], count }`.
2. **`tflint_plugins_hint`** — `{ text }` → `{ plugins: [{name?, source?, version?}], count }`.
   - Looks for `plugin "name" { source = … version = … enabled = … }`.

## Example prompts

- "List the TFLint rule blocks and which are enabled in this .tflint.hcl"
- "Which TFLint plugins (name/source/version) does this config declare?"
- "Inventory rule enable/disable and plugin blocks in this paste"
