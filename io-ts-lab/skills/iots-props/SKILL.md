---
name: iots-props
description: >
  List io-ts export/const codecs (t.type / t.interface / t.partial / t.array /
  t.union / t.intersection / t.strict) and prop hints from pasted io-ts TypeScript.
  Local only — no decode()/encode(), no fetch.
version: 1.0.0
tags: [io-ts, schema, props, validation, local]
---

# io-ts codecs & props

Use these tools when the user pastes io-ts TypeScript text (never fetch a remote file, never call io-ts `decode()` / `encode()`):

1. **`iots_codecs_list`** with `source` — → `{codecs: [{name?, kind}], count}`.
2. **`iots_props_hint`** with `source` — → `{fields: [{field, typeHint?}], count}`.

Lite TypeScript scanner. Input cap ~1MB. Documented limitations apply (not io-ts runtime; no network).

## Example prompts

- "List io-ts codecs exported from this file."
- "What props does User declare?"
- "What type hints are on these t.type({ keys?"
