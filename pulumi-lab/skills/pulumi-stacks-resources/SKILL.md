---
name: pulumi-stacks-resources
description: >
  Inventory Pulumi.yaml project/stack hints (name, runtime, description, main, backend)
  and heuristic resource constructors from program text with the local zero-auth
  pulumi-lab MCP. YAML/string/regex only — no Pulumi CLI, cloud, or network.
version: 1.0.0
tags: [pulumi, stacks, resources, iac, mcp, developer-tools]
---

# Pulumi stacks & resources

When the user pastes **Pulumi.yaml** or Pulumi program text:

1. **`pulumi_stacks_list`** — `{ text }` → `{ stacks: [{name?, runtime?, description?, main?, backend?}], count }`.
2. **`pulumi_resources_hint`** — `{ text }` → `{ resources: [{type?, name?}], count }`.
   - Looks for `new aws.` / `new azure.` / `new gcp.`, `pulumi.CustomResource`,
     component resources, and YAML `type:` resources.

## Example prompts

- "Parse this Pulumi.yaml — what project name and runtime?"
- "What resources does this Pulumi TypeScript program declare?"
- "List backend URL and main entry from this Pulumi project"
