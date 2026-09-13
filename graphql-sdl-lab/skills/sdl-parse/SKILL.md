---
name: sdl-parse
description: "Parse pasted GraphQL SDL locally with zero-auth MCP tools: list types, list fields, find a type. Lite regex scanner — not a full GraphQL spec parser. No network fetch."
version: 1.0.0
tags: [graphql, sdl, schema, parse, local]
---

# SDL parse

Use these tools when the user pastes GraphQL SDL (never fetch a remote schema):

1. **`sdl_parse_types`** with `sdl` — → `{types: [{kind, name, implements?}]}`.
2. **`sdl_list_fields`** with `sdl` + `typeName` — fields for type/interface/input.
3. **`sdl_find_type`** with `sdl` + `name` — type block summary or not found.

Lite scanner: `#` comments and strings stripped loosely; common definitions only. Input cap ~1MB.

## Example prompts

- "Parse this SDL and list every type kind and name."
- "What fields and args does type User have?"
- "Find the Post type block in this schema."
