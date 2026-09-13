---
name: tb-compose-lint
description: >
  Extract TypeBox compose combinators (Union, Intersect, Partial, Pick, Ref, Recursive, …)
  and run educational heuristic lite lint on schema TS/JS text with the local zero-auth
  typebox-lab MCP. No @sinclair/typebox runtime, no network.
version: 1.0.0
tags: [typebox, schema, compose, lint, validation, developer-tools]
---

# TypeBox compose & lite lint

When the user wants compose-combinator inventory or a smell-check of pasted TypeBox source:

1. **`tb_compose_hint`** — `{ text }` → `{ compose: [{on?, kind}], count }` for `Union` / `Intersect` / `Partial` / `Required` / `Pick` / `Omit` / `Composite` / `Ref` / `Recursive` etc.
2. **`tb_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing Object, Any/Unsafe overuse, additionalProperties tip,
     Format (email/uri/uuid) tips, etc. Not an exploit guide.

## Example prompts

- "List Type.Union / Type.Pick / Type.Ref usage on these schemas"
- "Lite-lint this TypeBox file"
- "Any Type.Any / Type.Unsafe overuse or missing additionalProperties?"
