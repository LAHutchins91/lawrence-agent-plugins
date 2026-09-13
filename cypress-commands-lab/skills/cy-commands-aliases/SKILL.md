---
name: cy-commands-aliases
description: "Extract Cypress custom commands (Commands.add/addAll/overwrite) and aliases (.as / @alias) from JS/TS text with the local zero-auth cypress-commands-lab MCP. No Cypress/browser runtime, no network."
version: 1.0.0
tags: [cypress, custom-commands, aliases, developer-tools]
---

# Cypress commands & aliases

When the user pastes **Cypress support/commands or spec** source and needs command/alias inventory:

1. **`cy_commands_list`** — `{ text }` → `{ commands: [{name, overwrite?}], count }` from `Cypress.Commands.add(` / `addAll(` / `overwrite(`.
2. **`cy_aliases_hint`** — `{ text }` → `{ aliases: [{name}], count }` from `.as('alias')` / `@alias` usages.

## Example prompts

- "List custom Cypress commands in this support file"
- "Which aliases are defined or referenced?"
- "Any Commands.overwrite here?"
