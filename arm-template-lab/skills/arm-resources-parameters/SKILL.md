---
name: arm-resources-parameters
description: "Inventory Azure ARM template resources (type, name, apiVersion, location) and parameters (type / defaultValue / secureString) with the local zero-auth arm-template-lab MCP. JSON string only — no az CLI, deploy, or network."
version: 1.0.0
tags: [azure, arm, arm-template, resources, parameters, mcp, developer-tools]
---

# ARM resources & parameters

When the user pastes an **Azure ARM** template JSON:

1. **`arm_resources_list`** — `{ text }` → `{ resources: [{type?, name?, apiVersion?, location?}], count }`.
2. **`arm_parameters_hint`** — `{ text }` → `{ parameters: [{name, type?, hasDefault?, secure?}], count }`.
   - Marks `secureString` / `secureObject` as `secure: true` and notes `defaultValue` presence.

## Example prompts

- "List the resources in this ARM template"
- "What parameters does this template declare? Any secureString?"
- "Parse this azuredeploy.json — types and apiVersions?"
