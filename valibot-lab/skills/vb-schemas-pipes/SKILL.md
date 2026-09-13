---
name: vb-schemas-pipes
description: >
  Extract Valibot schema assignments and v.pipe chains from TS/JS text with
  the local zero-auth valibot-lab MCP. No valibot runtime, no network.
version: 1.0.0
tags: [valibot, schema, pipe, validation, developer-tools]
---

# Valibot schemas & pipes

When the user pastes **Valibot schema** source and needs schema inventory or pipe mapping:

1. **`vb_schemas_list`** — `{ text }` → `{ schemas: [{name, kind?}], count }` from `const Foo = v.object` / `export const` / `v.string` / named imports from `'valibot'`.
2. **`vb_pipes_hint`** — `{ text }` → `{ pipes: [{on?, steps: string[]}], count }` from `v.pipe(...)` chains.

## Example prompts

- "List Valibot schemas exported from this file"
- "What steps are in this v.pipe chain?"
- "Which consts are v.object vs v.pipe?"
