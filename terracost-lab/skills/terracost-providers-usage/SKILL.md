---
name: terracost-providers-usage
description: >
  Inventory Terracost / terraform cloud providers (aws, azurerm, google) and
  regions, plus usage-assumption / resource-count keys with the local zero-auth
  terracost-lab MCP. YAML/HCL/JSON string only — no terracost CLI, cloud pricing
  API, or network.
version: 1.0.0
tags: [terracost, terraform, yaml, providers, usage, mcp, developer-tools]
---

# Terracost providers & usage

When the user pastes **Terracost** / terraform config or usage-like YAML:

1. **`terracost_providers_list`** — `{ text }` → `{ providers: [{name?, region?}], count }`.
   - Looks for `aws` / `azurerm` / `google` provider blocks and region fields.
2. **`terracost_usage_hint`** — `{ text }` → `{ usageKeys: string[], count }`.
   - Looks for usage assumption / resource count keys (e.g. `monthly_*`, `hours`, `count`).

## Example prompts

- "Which cloud providers and regions does this terraform / terracost config reference?"
- "Extract usage assumption keys from this usage YAML"
- "Inventory providers and usage hints from this paste"
