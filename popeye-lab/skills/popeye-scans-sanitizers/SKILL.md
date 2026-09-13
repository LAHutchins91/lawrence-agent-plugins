---
name: popeye-scans-sanitizers
description: >
  Inventory Popeye scan sections / resource kinds and extract sanitizer /
  lint codes (e.g. POP-106) with the local zero-auth popeye-lab MCP.
  YAML / report string only — no popeye CLI or network.
version: 1.0.0
tags: [popeye, scans, sanitizers, codes, k8s, mcp, developer-tools]
---

# Popeye scans & sanitizers

When the user pastes a **Popeye spinach** config or report snippet:

1. **`popeye_scans_list`** — `{ text }` → `{ scans: [{section?, kind?}], count }`.
   - Looks for linter / resource sections under `excludes.linters`, report sections, and known kinds (pods, deployments, namespaces, …).
2. **`popeye_sanitizers_hint`** — `{ text }` → `{ sanitizers: string[], count }`.
   - Looks for codes like `POP-106`, `106`, and severity overrides under `code` / `codes`.

## Example prompts

- "Which Popeye scan sections / kinds are in this spinach YAML?"
- "What sanitizer codes (POP-*) are referenced here?"
- "List codes excluded or remapped in this Popeye config"
