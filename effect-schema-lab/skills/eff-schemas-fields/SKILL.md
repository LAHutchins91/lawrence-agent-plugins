---
name: eff-schemas-fields
description: >
  Extract Effect Schema assignments and Schema.Struct field hints from TS/JS text
  with the local zero-auth effect-schema-lab MCP. No Effect runtime, no network.
version: 1.0.0
tags: [effect, schema, fields, validation, developer-tools]
---

# Effect Schema schemas & fields

When the user pastes **Effect Schema** source and needs schema inventory or Struct field mapping:

1. **`eff_schemas_list`** — `{ text }` → `{ schemas: [{name, kind?}], count }` from `const Foo = Schema.Struct` / `S.String` / `export const` assignments (`import { Schema } from 'effect'` or `Schema as S`).
2. **`eff_fields_hint`** — `{ text }` → `{ fields: [{schema?, name, typeHint?}], count }` keys inside `Schema.Struct({ ... })`.

## Example prompts

- "List Effect Schema exports from this file"
- "What fields does UserSchema declare?"
- "Which Struct keys use Schema.optional or NullOr?"
