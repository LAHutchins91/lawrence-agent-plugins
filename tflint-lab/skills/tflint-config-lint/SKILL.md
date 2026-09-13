---
name: tflint-config-lint
description: >
  Extract TFLint config block fields (module, force, disabled_by_default, varfile,
  variables) plus educational lite lint with the local zero-auth tflint-lab MCP.
  No tflint CLI, terraform, or network. Not an exploit guide.
version: 1.0.0
tags: [tflint, config, lint, hcl, mcp, developer-tools]
---

# TFLint config & lite lint

When the user pastes **TFLint** config HCL or wants a smell-check:

1. **`tflint_config_hint`** — `{ text }` → `{ config: object, count }`.
   - `config { module, force, disabled_by_default, varfile, variables }`.
2. **`tflint_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing plugin aws/terraform, all rules disabled tip,
     outdated plugin version tip.
   - Not an exploit guide.

## Example prompts

- "Extract the TFLint config block fields from this .tflint.hcl"
- "Lint this TFLint config for missing aws/terraform plugins or all-rules-disabled"
- "Any outdated TFLint plugin version smells?"
