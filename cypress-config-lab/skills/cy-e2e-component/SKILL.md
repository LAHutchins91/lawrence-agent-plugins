---
name: cy-e2e-component
description: Extract Cypress e2e and component testing blocks from cypress.config text with the local zero-auth cypress-config-lab MCP. JSONC preferred; defineConfig / JS heuristics; no cypress binary or network.
version: 1.0.0
tags: [cypress, cypress-config, e2e, component, developer-tools]
---

# Cypress e2e & component summary

When the user pastes **Cypress config** (`cypress.config.*`, JSONC, or defineConfig) and needs e2e/component inventory:

1. **`cy_e2e_summary`** — `{ text }` → `{ e2e?: { baseUrl?, specPattern?, supportFile?, … }, keys }`.
2. **`cy_component_summary`** — `{ text }` → `{ component?: { devServer?, specPattern?, supportFile?, … }, keys }`.

## Example prompts

- "What is the e2e baseUrl / specPattern in this Cypress config?"
- "Summarize the component testing block"
- "Does this defineConfig set supportFile?"
