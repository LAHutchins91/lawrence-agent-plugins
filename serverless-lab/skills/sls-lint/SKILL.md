---
name: sls-lint
description: >
  List Serverless resource keys (resources.Resources / provider.iam / layers /
  plugins / custom / package / vpc) and lite-lint for missing service:/provider:,
  wildcard IAM Action/Resource '*', empty file, and EOL nodejs12.x/nodejs14.x.
  Local only, never runs Serverless Framework CLI or AWS deploy, no fetch.
version: 1.0.0
tags: [serverless, aws-lambda, yaml, lint, iam, local]
---

# Serverless resources & lite lint

Use these tools on pasted serverless.yml / serverless.ts source (do not fetch URLs or run serverless CLI):

1. **`sls_resources_hint`** with `source` — → `{resources: [{method, count}], count}`.
2. **`sls_lint_lite`** with `source` — findings:
   - missing service: (warning)
   - missing provider: (warning)
   - wildcard IAM Action/Resource '*' (warning)
   - Empty file (warning)
   - EOL nodejs12.x / nodejs14.x (info)

Disclaimer only — not the Serverless Framework CLI. Lite scanner.

## Example prompts

- "Any wildcard IAM in this serverless.yml?"
- "Does this file declare service and provider?"
- "Lint this serverless config for EOL Node runtimes"
