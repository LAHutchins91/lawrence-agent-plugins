---
name: chef-cookbooks-recipes
description: "Inventory Chef cookbooks (metadata.rb / Policyfile / Berksfile name, version, depends, supports) and recipe resources (package, service, template, file, directory, execute, include_recipe) with the local zero-auth chef-lab MCP. Ruby DSL string only — no Chef CLI, knife, or network."
version: 1.0.0
tags: [chef, cookbook, recipe, resources, mcp, developer-tools]
---

# Chef cookbooks & recipes

When the user pastes **Chef** metadata / Policyfile / Berksfile / recipe Ruby:

1. **`chef_cookbooks_list`** — `{ text }` → `{ cookbooks: [{name?, version?, depends?}], count }`.
2. **`chef_recipes_hint`** — `{ text }` → `{ resources: [{type?, name?}], includes?: string[], count }`.
   - Looks for common resources and `include_recipe`.

## Example prompts

- "List cookbooks and depends from this metadata.rb"
- "What resources does this Chef recipe use?"
- "Parse this Berksfile — cookbook names and versions?"
