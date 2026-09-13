---
name: terracost-plan-lint
description: >
  Heuristic scan of terraform plan JSON / plan-file refs plus educational lite
  lint with the local zero-auth terracost-lab MCP. No terracost CLI, pricing API,
  or network. Never returns secret values. Not an exploit guide.
version: 1.0.0
tags: [terracost, terraform, plan, lint, mcp, developer-tools]
---

# Terracost plan & lite lint

When the user pastes a **terraform plan JSON** snippet, plan-file path, or wants a smell-check:

1. **`terracost_plan_hint`** — `{ text }` → `{ planPath?, resourceTypes: string[], changeCount? }`.
   - Looks for `resource_changes` types and plan path refs.
2. **`terracost_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing provider, plaintext API/token key tip, missing plan file tip.
   - Not an exploit guide.

## Example prompts

- "What resource types are in this terraform plan JSON?"
- "Lint this Terracost config for missing provider or plaintext api_key"
- "Any missing plan file smell in this paste?"
