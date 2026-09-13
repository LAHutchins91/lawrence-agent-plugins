---
name: kubeval-strict-lint
description: >
  Detect kubeval --strict / --ignore-missing-schemas / --quiet / --force-color
  and run educational lite lint with the local zero-auth kubeval-lab MCP.
  No kubeval CLI or network. Educational K8s tips only — not an exploit guide.
version: 1.0.0
tags: [kubeval, strict, lint, k8s, mcp, developer-tools]
---

# Kubeval strict & lite lint

When the user pastes **kubeval flags / config** or wants a smell-check:

1. **`kubeval_strict_hint`** — `{ text }` → `{ strict?, ignoreMissingSchemas?, quiet? }`.
   - Looks for `--strict`, `--ignore-missing-schemas`, `--quiet`, `--force-color`.
2. **`kubeval_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing schema location, missing k8s version tip, plaintext token in schema URL tip.
   - Not an exploit guide.

## Example prompts

- "Is --strict / --quiet set in this kubeval paste?"
- "Lint this kubeval command for missing schema-location or k8s version"
- "Any plaintext token smell in this schema URL?"
