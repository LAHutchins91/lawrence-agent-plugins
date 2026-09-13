---
name: dep-risk-audit
description: >
  Audit package.json dependency ranges for risk — wildcards, floating
  latest/x, caret on 0.x, bare ^N, and wide-open >= (local zero-auth MCP).
version: 1.0.0
tags: [semver, dependencies, risk, package.json, audit]
---

# Dep risk audit

When reviewing dependency declarations:

1. Call **`dep_range_risk`** with `{ dependencies }` (name → range map).
2. Summarize `summary` counts and highlight every `high` finding with its `note`.
3. Suggest pins, tilde, or bounded caret ranges; re-check with **`semver_satisfies`** / **`semver_expand_min`** if needed.

## Example prompts

- "Score the risk of these package.json dependencies"
- "Is ^0.8.0 safe for a 0.x library?"
- "Flag anything using * or latest"
