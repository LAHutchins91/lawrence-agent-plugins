---
name: tf-list
description: >
  Parse pasted Terraform HCL text locally with zero-auth MCP tools:
  list resources, list modules with source, look up variables.
  Lite regex scanner — not terraform CLI. No network.
version: 1.0.0
tags: [terraform, hcl, parse, local]
---

# TF list

Use these tools when the user pastes Terraform HCL text (never fetch a remote file, never run terraform):

1. **`tf_list_resources`** with `hcl` — → `{resources: [{type, name}]}`.
2. **`tf_list_modules`** with `hcl` — → `{modules: [{name, source?}]}`.
3. **`tf_var_lookup`** with `hcl` + `name` — `{type?, default?, description?}` when simple attrs present.

Lite scanner: `#` / `//` / `/* */` comments stripped loosely; common Terraform HCL only. Input cap ~1MB.

## Example prompts

- "List every resource in this Terraform snippet."
- "What modules does this HCL call, and from which sources?"
- "Look up variable region in this pasted terraform."
