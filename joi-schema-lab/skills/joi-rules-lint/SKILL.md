---
name: joi-rules-lint
description: >
  Extract Joi chained rules (.min/.max/.email/.when/.custom/…) and run educational
  heuristic lite lint on schema JS/TS text with the local zero-auth joi-schema-lab MCP.
  No joi runtime, no network.
version: 1.0.0
tags: [joi, rules, lint, validation, developer-tools]
---

# Joi rules & lite lint

When the user wants rule/chain inventory or a smell-check of pasted Joi schema source:

1. **`joi_rules_hint`** — `{ text }` → `{ rules: [{on?, kind}], count }` for `.min` / `.max` / `.email` / `.uri` / `.pattern` / `.valid` / `.when` / `.custom` / `.messages` etc.
2. **`joi_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, deprecated `Joi.reach` / `assert` tips, `allow(null)` vs `optional`,
     `.unknown(true)` tip, etc. Not an exploit guide.

## Example prompts

- "List .min / .email / .when chains on these Joi schemas"
- "Lite-lint this Joi file"
- "Any allow(null) vs optional or Joi.reach smells?"
