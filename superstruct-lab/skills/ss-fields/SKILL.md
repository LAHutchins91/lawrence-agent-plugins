---
name: ss-fields
description: >
  List Superstruct export/const names (object({ / type({ / struct() and
  object field hints from pasted Superstruct JS/TS. Local only — no assert()/validate(), no fetch.
version: 1.0.0
tags: [superstruct, schema, fields, validation, local]
---

# Superstruct structs & fields

Use these tools when the user pastes Superstruct JS/TS text (never fetch a remote file, never call Superstruct `assert()` / `validate()`):

1. **`ss_structs_list`** with `source` — → `{structs: [{name?, kind}], count}`.
2. **`ss_fields_hint`** with `source` — → `{fields: [{field, typeHint?}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not Superstruct runtime; no network).

## Example prompts

- "List Superstruct structs exported from this file."
- "What fields does User declare?"
- "What type hints are on these object({ keys?"
