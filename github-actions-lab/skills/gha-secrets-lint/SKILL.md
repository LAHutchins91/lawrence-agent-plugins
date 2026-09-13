---
name: gha-secrets-lint
description: Extract secrets.NAME references (names only) and run educational heuristic lite lint on GitHub Actions workflow YAML text with the local zero-auth github-actions-lab MCP. No GitHub API/network; never returns secret values.
version: 1.0.0
tags: [github-actions, gha, workflow, yaml, secrets, lint, developer-tools]
---

# GHA secrets refs & lite lint

When the user wants secret **name** inventory or quick smell checks from **workflow YAML text**:

1. **`gha_secrets_refs`** — `{ text }` → `{ secrets, count }`.
   - Finds `secrets.NAME` / `${{ secrets.NAME }}` — **names only**, never values.
2. **`gha_lint_lite`** — `{ text }` → `{ findings, findingCount }`.
   - Educational heuristics: pull_request_target notes, missing permissions,
     curl|bash smells, actions@master / unpinned refs. Not an exploit guide.

## Example prompts

- "Which secrets are referenced in this workflow?"
- "Lite-lint this Actions YAML for common smells"
- "Does this workflow use pull_request_target with checkout?"
