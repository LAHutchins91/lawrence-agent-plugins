---
name: gqlc-scalars-lint
description: "Extract config.scalars and run educational heuristic lite lint with the local zero-auth graphql-codegen-lab MCP. No codegen runtime, no network."
version: 1.0.0
tags: [graphql-codegen, graphql, scalars, lint, config, developer-tools]
---

# GraphQL Codegen scalars & lite lint

When the user wants scalar mappings or a smell-check of pasted codegen config:

1. **`gqlc_scalars_hint`** — `{ text }` → `{ scalars: Record<string,string>, count }` for `config.scalars` / `scalars:`.
2. **`gqlc_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing schema tip, no documents tip, plaintext headers/auth tip, etc. Not an exploit guide.

## Example prompts

- "What scalar mappings does this codegen config declare?"
- "Lite-lint this codegen.yml for missing schema and plaintext Authorization headers"
- "Any secrets in this remote schema headers block?"
