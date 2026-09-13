---
name: vb-actions-lint
description: >
  Extract Valibot action usage (email, minLength, transform, check, …) and run
  educational heuristic lite lint on schema TS/JS text with the local zero-auth
  valibot-lab MCP. No valibot runtime, no network.
version: 1.0.0
tags: [valibot, actions, lint, validation, developer-tools]
---

# Valibot actions & lite lint

When the user wants action inventory or a smell-check of pasted Valibot schema source:

1. **`vb_actions_hint`** — `{ text }` → `{ actions: [{name, count}], total }` for `v.minLength`, `v.email`, `v.url`, `v.regex`, `v.transform`, `v.check`, `v.forward`, etc.
2. **`vb_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing pipe for validations tip, any()/unknown() overuse,
     deprecated action-array args / coerce tips, etc. Not an exploit guide.

## Example prompts

- "Count Valibot actions in this file"
- "Lite-lint this Valibot schema"
- "Any v.any() overuse or missing v.pipe smells?"
