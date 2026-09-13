---
name: eslint-env-lint
description: >
  Extract env/parser/plugins and run educational heuristic lite lint
  on ESLint config text with the local zero-auth eslint-config-lab MCP.
  No eslint binary.
version: 1.0.0
tags: [eslint, eslint-config, env, parser, lint, developer-tools]
---

# ESLint env/parser & lite lint

When the user wants env/parser/plugins inventory or quick smell checks from **ESLint config text**:

1. **`eslint_env_parser`** — `{ text }` → `{ env?, parser?, parserOptions?, plugins? }`.
2. **`eslint_lint_lite`** — `{ text }` → `{ findings, findingCount }`.
   - Educational heuristics: empty config, extends needing plugins, all rules off,
     `eslint:recommended` alone, recommended+all conflict, sparse config, JS heuristic limits, etc.
     Not an exploit guide.

## Example prompts

- "What env and parser does this eslintrc use?"
- "Lite-lint this ESLint config for common smells"
- "Does this extends need plugins declared?"
