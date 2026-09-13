---
name: cdktf-resources-lint
description: >
  Heuristic CDKTF resource constructors (S3Bucket, Instance, TerraformResource,
  HCL synth paste) and educational lite lint with the local zero-auth
  terraform-cdk-lab MCP. No CDKTF CLI, Terraform apply, or network.
version: 1.0.0
tags: [cdktf, terraform, resources, lint, mcp, developer-tools]
---

# CDKTF resources & lite lint

When the user pastes **CDKTF** program / synth HCL text or wants a smell-check:

1. **`cdktf_resources_hint`** — `{ text }` → `{ resources: [{type?, name?}], count }`.
2. **`cdktf_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing language/app, hardcoded secrets/AKIA,
     `:latest` AMIs/tags, missing backend tip.
   - Not an exploit guide.

## Example prompts

- "What resources does this CDKTF TypeScript stack declare?"
- "Lint this cdktf.json for missing language/app"
- "Any AKIA or :latest AMI tips in this construct?"
