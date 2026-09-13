---
name: kyverno-mutate-lint
description: >
  Extract Kyverno mutate rules (patchesJson6902 / patchStrategicMerge / targets)
  and run educational lite lint with the local zero-auth kyverno-lab MCP.
  No kyverno CLI or network. Educational policy tips only — not an exploit guide.
version: 1.0.0
tags: [kyverno, mutate, lint, k8s, mcp, developer-tools]
---

# Kyverno mutate & lite lint

When the user pastes a **mutate** rule or wants a smell-check:

1. **`kyverno_mutate_hint`** — `{ text }` → `{ mutates: [{name?, style?}], count }`.
   - Looks for `mutate.patchesJson6902`, `patchStrategicMerge`, and `targets`.
2. **`kyverno_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing rules, overly broad match, privileged allow tip.
   - Not an exploit guide.

## Example prompts

- "What mutate styles (JSON6902 / strategic merge) are in this policy?"
- "Lint this Kyverno policy for missing rules or over-broad match"
- "Any privileged-allow smell in this validate pattern?"
