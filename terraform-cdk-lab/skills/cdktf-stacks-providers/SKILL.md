---
name: cdktf-stacks-providers
description: >
  Inventory CDKTF stacks/apps (language, app, projectId, terraformProviders)
  and provider import/constructor hints with the local zero-auth terraform-cdk-lab
  MCP. JSON/string/regex only — no CDKTF CLI, Terraform apply, or network.
version: 1.0.0
tags: [cdktf, terraform, stacks, providers, mcp, developer-tools]
---

# CDKTF stacks & providers

When the user pastes **cdktf.json** or CDKTF TypeScript / program text:

1. **`cdktf_stacks_list`** — `{ text }` → `{ stacks: [{name?, language?, app?}], language?, providers?, count }`.
2. **`cdktf_providers_hint`** — `{ text }` → `{ providers: string[], count }`.
   - Looks for `terraformProviders` in cdktf.json, `import { AwsProvider }`,
     `@cdktf/provider-*`, and `new AwsProvider`.

## Example prompts

- "Parse this cdktf.json — what language and app entry?"
- "Which providers does this CDKTF TypeScript stack use?"
- "List TerraformStack classes from this main.ts"
