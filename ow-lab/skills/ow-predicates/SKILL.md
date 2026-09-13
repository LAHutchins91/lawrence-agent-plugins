---
name: ow-predicates
description: >
  List sindresorhus ow predicate counts (ow.string / ow.number / ow.boolean /
  ow.array / ow.object / ow.any / ow.optional) and shape hints
  (partialShape / exactShape / ofType) from pasted ow JS/TS.
  Local only — never ow() assert, no fetch.
version: 1.0.0
tags: [ow, sindresorhus, predicates, validation, local]
---

# Ow predicates & shapes

Use these tools when the user pastes ow JS/TS text (never fetch a remote file, never call `ow()`):

1. **`ow_predicates_list`** with `source` — → `{predicates: [{predicate, count}], count}`.
2. **`ow_shapes_hint`** with `source` — → `{shapes: [{kind, count}], count}`.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not ow runtime; no network).

## Example prompts

- "How many ow.string predicates are in this file?"
- "Does this use exactShape or partialShape?"
- "List ow predicate usage counts."
