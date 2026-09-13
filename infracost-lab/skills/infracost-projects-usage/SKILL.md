---
name: infracost-projects-usage
description: >
  Inventory Infracost projects (path, name, terraform_var_files) and extract
  usage-file / resource_usage keys with the local zero-auth infracost-lab MCP.
  YAML string only — no infracost CLI, cloud pricing API, or network.
version: 1.0.0
tags: [infracost, terraform, yaml, projects, usage, mcp, developer-tools]
---

# Infracost projects & usage

When the user pastes **Infracost** YAML (`infracost.yml` / usage file / …):

1. **`infracost_projects_list`** — `{ text }` → `{ projects: [{path?, name?, varFiles?}], count }`.
2. **`infracost_usage_hint`** — `{ text }` → `{ usageKeys: string[], resources?: string[], count }`.
   - Looks for `usage_file`, `resource_usage`, `resource_type_default_usage`, and metric keys.

## Example prompts

- "List the Infracost projects (path/name/var files) in this infracost.yml"
- "Which usage keys / resource addresses does this infracost-usage.yml declare?"
- "Inventory projects and usage file hints from this paste"
