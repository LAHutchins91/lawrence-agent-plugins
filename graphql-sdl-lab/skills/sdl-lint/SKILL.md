---
name: sdl-lint
description: "Lite-lint pasted GraphQL SDL for missing Query/Mutation roots, duplicate type names, empty bodies, and reserved name clashes. Local only, no fetch."
version: 1.0.0
tags: [graphql, sdl, lint, schema, local]
---

# SDL lint

Use **`sdl_lint_lite`** with `sdl` on pasted GraphQL SDL (do not fetch URLs):

- Missing `type Query` (warning) / `type Mutation` (info)
- Duplicate type names (error)
- Empty or missing type bodies (warning)
- Built-in / introspection reserved name clashes (error)

Heuristic only — not a full schema validator or GraphQL spec checker.

## Example prompts

- "Lint this SDL for duplicate types and missing Query."
- "Any reserved name clashes in this schema?"
- "Does this pasted SDL have empty type bodies?"
