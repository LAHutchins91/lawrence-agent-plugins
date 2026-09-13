---
name: cy-env-lint
description: "List Cypress env keys (with optional secret redaction) and run educational heuristic lite lint with the local zero-auth cypress-config-lab MCP. No cypress binary, no network."
version: 1.0.0
tags: [cypress, cypress-config, env, lint, developer-tools]
---

# Cypress env keys & lite lint

When the user wants env inventory or a smell-check of pasted Cypress config text:

1. **`cy_env_keys`** — `{ text }` → `{ env, keys, count }`.
   - Merges top-level `env` with nested `e2e.env` / `component.env`.
   - Obvious secret-looking values redacted to `[REDACTED]`; keys always listed.
2. **`cy_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing e2e+component, `chromeWebSecurity: false`,
     video/screenshot defaults, hardcoded secrets in env, deprecated keys
     (`integrationFolder`, `testFiles`, `pluginsFile`), JS heuristic limits.
     Not an exploit guide.

## Example prompts

- "What env keys are in this Cypress config?"
- "Lite-lint this cypress.config.ts"
- "Any deprecated Cypress options here?"
