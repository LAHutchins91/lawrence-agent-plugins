---
name: zod-schemas-fields
description: "Extract Zod schema assignments and z.object field hints from TS/JS text with the local zero-auth zod-schema-lab MCP. No zod runtime, no network."
version: 1.0.0
tags: [zod, schema, fields, validation, developer-tools]
---

# Zod schemas & fields

When the user pastes **Zod schema** source and needs schema inventory or object field mapping:

1. **`zod_schemas_list`** — `{ text }` → `{ schemas: [{name, kind?}], count }` from `const Foo = z.object` / `export const` / `z.array` / `z.string` assignments.
2. **`zod_fields_hint`** — `{ text }` → `{ fields: [{schema?, name, zodType?, optional?, nullable?}], count }` keys inside `z.object({ ... })`.

## Example prompts

- "List Zod schemas exported from this file"
- "What fields does UserSchema declare?"
- "Which object keys are optional or nullable?"
