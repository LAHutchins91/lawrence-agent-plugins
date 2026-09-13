---
name: ark-props
description: >
  List ArkType export/const types (type({ ... }) object / type("...") stringDef)
  and prop hints from pasted ArkType TypeScript. Local only — never
  type().assert(), no fetch.
version: 1.0.0
tags: [arktype, schema, props, validation, local]
---

# ArkType types & props

Use these tools when the user pastes ArkType TypeScript text (never fetch a remote file, never call `type().assert()`):

1. **`ark_types_list`** with `source` — → `{types: [{name?, kind}], count}`.
2. **`ark_props_hint`** with `source` — → `{fields: [{field, defHint?}], count}`.

Lite TypeScript scanner. Input cap ~1MB. Documented limitations apply (not ArkType runtime; no network).

## Example prompts

- "List ArkType types exported from this file."
- "What props does User declare?"
- "What def hints are on these type({ keys?"
