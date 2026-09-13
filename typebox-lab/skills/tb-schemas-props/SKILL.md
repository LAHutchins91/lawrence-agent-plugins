---
name: tb-schemas-props
description: "Extract TypeBox schema assignments and Type.Object property hints from TS/JS text with the local zero-auth typebox-lab MCP. No @sinclair/typebox runtime, no network."
version: 1.0.0
tags: [typebox, schema, properties, validation, developer-tools]
---

# TypeBox schemas & object props

When the user pastes **TypeBox** source and needs schema inventory or Object property mapping:

1. **`tb_schemas_list`** — `{ text }` → `{ schemas: [{name, kind?}], count }` from `const Foo = Type.Object` / `Type.String` / `Type.Array` / `export const` assignments (`import { Type } from '@sinclair/typebox'` or `Type as T`).
2. **`tb_props_hint`** — `{ text }` → `{ props: [{schema?, name, typeHint?}], count }` keys inside `Type.Object({ ... })`.

## Example prompts

- "List TypeBox schemas exported from this file"
- "What properties does UserSchema declare?"
- "Which Object keys use Type.Optional or Type.Array?"
