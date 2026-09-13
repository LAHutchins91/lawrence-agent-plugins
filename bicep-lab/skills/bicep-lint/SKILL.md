---
name: bicep-lint
description: >
  List Bicep module / existing / output / var / targetScope counts and
  lite-lint for missing targetScope, params without type, http:// module
  paths, empty file, and Password/Secret/Token params without @secure().
  Local only, never runs Azure CLI or bicep CLI, no fetch.
version: 1.0.0
tags: [bicep, azure, arm, lint, modules, local]
---

# Bicep modules & lite lint

Use these tools on pasted Bicep source (do not fetch URLs or run Azure CLI / bicep CLI):

1. **`bicep_modules_hint`** with `source` — → `{modules: [{method, count}], count}`.
2. **`bicep_lint_lite`** with `source` — findings:
   - missing targetScope (info)
   - param without type (warning)
   - module path http:// (info)
   - Empty file (warning)
   - Password/Secret/Token without @secure() (warning)

Disclaimer only — not the Azure CLI or bicep CLI. Lite scanner.

## Example prompts

- "Any http:// module references in this Bicep?"
- "Are secret params missing @secure()?"
- "Lint this Bicep for missing targetScope"
