---
name: rt-fields
description: >
  List Runtypes export/const types (Record({ / Object({ / Array( / Union( /
  Literal( / String / Number) and field hints from pasted Runtypes TypeScript.
  Local only — never .check()/.guard(), no fetch.
version: 1.0.0
tags: [runtypes, schema, fields, validation, local]
---

# Runtypes types & fields

Use these tools when the user pastes Runtypes TypeScript text (never fetch a remote file, never call `.check()` / `.guard()`):

1. **`rt_types_list`** with `source` — → `{types: [{name?, kind}], count}`.
2. **`rt_fields_hint`** with `source` — → `{fields: [{field, typeHint?}], count}`.

Lite TypeScript scanner. Input cap ~1MB. Documented limitations apply (not Runtypes runtime; no network).

## Example prompts

- "List Runtypes types exported from this file."
- "What fields does User declare?"
- "What type hints are on these Record({ keys?"
