---
name: popeye-excludes-lint
description: >
  Extract Popeye excludes (namespaces / FQNs / codes) and run educational
  lite lint with the local zero-auth popeye-lab MCP.
  No popeye CLI or network. Educational K8s tips only — not an exploit guide.
version: 1.0.0
tags: [popeye, excludes, lint, k8s, mcp, developer-tools]
---

# Popeye excludes & lite lint

When the user pastes a **spinach.yml** / excludes block, or wants a smell-check:

1. **`popeye_excludes_hint`** — `{ text }` → `{ excludes: [{namespace?, name?, codes?}], count }`.
   - Looks for `excludes.global`, `excludes.linters.*.instances`, legacy `excludes.<kind>` lists.
2. **`popeye_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, all excluded, privileged/hostNetwork tip, missing spinach config.
   - Not an exploit guide.

## Example prompts

- "What namespaces / FQNs are excluded in this spinach YAML?"
- "Lint this Popeye config for over-broad excludes or missing spinach"
- "Any privileged / hostNetwork smell in this sample YAML?"
