---
name: cfn-lint
description: >
  List CloudFormation Outputs keys (Outputs / Export / Value / Description /
  Condition) and lite-lint for missing Resources:, wildcard IAM Action/Resource
  '*', Password/Secret/Token params without NoEcho, empty file, and hardcoded
  ami-/12-digit account ids. Local only, never runs AWS CLI or cfn-lint binary,
  no fetch.
version: 1.0.0
tags: [cloudformation, aws, cfn, yaml, lint, iam, local]
---

# CloudFormation outputs & lite lint

Use these tools on pasted CloudFormation YAML/JSON source (do not fetch URLs or run AWS CLI / cfn-lint):

1. **`cfn_outputs_hint`** with `source` — → `{outputs: [{method, count}], count}`.
2. **`cfn_lint_lite`** with `source` — findings:
   - missing Resources: (warning)
   - wildcard IAM Action/Resource '*' (warning)
   - Password/Secret/Token without NoEcho (warning)
   - Empty file (warning)
   - Hardcoded ami- / 12-digit account id (info)

Disclaimer only — not the AWS CLI or cfn-lint. Lite scanner.

## Example prompts

- "Any wildcard IAM in this CloudFormation template?"
- "Are secret parameters missing NoEcho?"
- "Lint this template for hardcoded AMI or account IDs"
