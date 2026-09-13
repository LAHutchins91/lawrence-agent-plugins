---
name: infracost-currency-lint
description: >
  Extract Infracost currency / timezone / pricing-API key-name hints plus
  educational lite lint with the local zero-auth infracost-lab MCP.
  No infracost CLI, pricing API, or network. Never returns API key values.
  Not an exploit guide.
version: 1.0.0
tags: [infracost, currency, lint, yaml, mcp, developer-tools]
---

# Infracost currency & lite lint

When the user pastes **Infracost** config YAML or wants a smell-check:

1. **`infracost_currency_hint`** — `{ text }` → `{ currency?, timezone?, hasApiKeyRef?: boolean }`.
   - Key *names* only — never API key *values*.
2. **`infracost_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing projects, plaintext API key tip, missing usage file tip.
   - Not an exploit guide.

## Example prompts

- "What currency and timezone does this infracost.yml set?"
- "Lint this Infracost config for missing projects or plaintext api_key"
- "Any missing usage_file smell in this paste?"
