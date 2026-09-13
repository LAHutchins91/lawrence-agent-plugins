---
name: oz-ops-lint
description: "Summarize OpenAPI operations and run educational heuristic lite lint on YAML/JSON text with the local zero-auth openapi-zod-lab MCP. No Zod runtime, no codegen."
version: 1.0.0
tags: [openapi, zod, operations, lint, developer-tools]
---

# OpenAPI ops & lite lint

When the user wants operation inventory or a smell-check of pasted OpenAPI source for Zod mapping:

1. **`oz_ops_hint`** — `{ text }` → `{ operations: [{operationId?, method, path, tags?, requestBody?, responses}], count }`.
2. **`oz_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing openapi/swagger version, no paths, unused schemas tip,
     nullable vs optional mapping tip, etc. Not an exploit guide.

## Example prompts

- "Summarize operations in this OpenAPI spec"
- "Lite-lint this OpenAPI for Zod mapping smells"
- "Any unused schemas or nullable/optional mapping tips?"
