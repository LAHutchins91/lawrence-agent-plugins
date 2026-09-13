---
name: pulumi-config-lint
description: >
  Extract Pulumi config keys (config: / pulumi.Config / config.require / config.get /
  secret keys) and educational lite lint with the local zero-auth pulumi-lab MCP.
  No Pulumi CLI, cloud, or network.
version: 1.0.0
tags: [pulumi, config, lint, iac, mcp, developer-tools]
---

# Pulumi config & lite lint

When the user pastes **Pulumi.yaml** / stack config / program text or wants a smell-check:

1. **`pulumi_config_hint`** — `{ text }` → `{ configKeys: string[], secretKeys?: string[], count }`.
2. **`pulumi_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing name/runtime, plaintext secret in config,
     `:latest` image tags, hardcoded AKIA/api keys tip, missing backend tip.
   - Not an exploit guide.

## Example prompts

- "What config keys does this Pulumi project use?"
- "Lint this Pulumi.yaml for missing runtime and plaintext secrets"
- "Any :latest tags or hardcoded AKIA tips in this program?"
