---
name: joi-schemas-fields
description: "Extract Joi schema assignments and Joi.object field hints from JS/TS text with the local zero-auth joi-schema-lab MCP. No joi runtime, no network."
version: 1.0.0
tags: [joi, schema, fields, validation, developer-tools]
---

# Joi schemas & fields

When the user pastes **Joi schema** source and needs schema inventory or object field mapping:

1. **`joi_schemas_list`** — `{ text }` → `{ schemas: [{name, kind?}], count }` from `const Foo = Joi.object` / `joi.string` / `export const` assignments.
2. **`joi_fields_hint`** — `{ text }` → `{ fields: [{schema?, name, joiType?, required?, optional?}], count }` keys inside `Joi.object({ ... })`.

## Example prompts

- "List Joi schemas exported from this file"
- "What fields does UserSchema declare?"
- "Which object keys are required or optional?"
