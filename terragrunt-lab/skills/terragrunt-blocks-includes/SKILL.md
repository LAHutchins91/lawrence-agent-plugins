---
name: terragrunt-blocks-includes
description: >
  Inventory Terragrunt top-level HCL blocks (terraform, remote_state, inputs,
  locals, generate, catalog) and extract include / find_in_parent_folders path
  hints with the local zero-auth terragrunt-lab MCP. String/regex only — no
  terragrunt CLI, terraform apply, or network.
version: 1.0.0
tags: [terragrunt, hcl, include, blocks, mcp, developer-tools]
---

# Terragrunt blocks & includes

When the user pastes **Terragrunt** HCL (`terragrunt.hcl` / …):

1. **`terragrunt_blocks_list`** — `{ text }` → `{ blocks: [{type, name?}], count }`.
2. **`terragrunt_includes_hint`** — `{ text }` → `{ includes: [{name?, path?}], count }`.
   - Looks for `include "name" { path = … }` and `find_in_parent_folders(…)` path hints.

## Example prompts

- "List the top-level Terragrunt blocks in this terragrunt.hcl"
- "Which includes / find_in_parent_folders paths does this config declare?"
- "Inventory terraform, remote_state, inputs, and generate blocks in this paste"
