---
name: yup-fields
description: "List Yup schema export/const names (yup.object / object({ / yup.string…) and object field hints from pasted Yup JS/TS. Local only — no Yup validate(), no fetch."
version: 1.0.0
tags: [yup, schema, fields, validation, local]
---

# Yup schemas & fields

Use these tools when the user pastes Yup schema JS/TS text (never fetch a remote file, never call Yup `validate()`):

1. **`yup_schemas_list`** with `source` — → `{schemas: [{name?, kind}], count}`.
2. **`yup_fields_hint`** with `source` — → `{fields: [{field, typeHint?}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not Yup runtime; no network).

## Example prompts

- "List Yup schemas exported from this file."
- "What fields does UserSchema declare?"
- "What type hints are on these yup.object keys?"
