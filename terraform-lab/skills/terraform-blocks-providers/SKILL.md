---
name: terraform-blocks-providers
description: >
  Inventory Terraform top-level HCL blocks (resource, data, variable, output,
  locals, terraform, provider, module) and extract required_providers / provider
  hints with the local zero-auth terraform-lab MCP. String/regex only — no
  terraform CLI, plan/apply, or network.
version: 1.0.0
tags: [terraform, hcl, provider, blocks, mcp, developer-tools]
---

# Terraform blocks & providers

When the user pastes **Terraform** HCL (`main.tf` / `versions.tf` / …):

1. **`terraform_blocks_list`** — `{ text }` → `{ blocks: [{type, name?, labels?}], count }`.
2. **`terraform_providers_hint`** — `{ text }` → `{ providers: [{name?, source?, version?}], count }`.
   - Looks for `terraform { required_providers { … } }` and top-level `provider "name" { … }`.

## Example prompts

- "List the top-level Terraform blocks in this main.tf"
- "Which providers / required_providers does this config declare?"
- "Inventory resources, modules, and providers in this paste"
