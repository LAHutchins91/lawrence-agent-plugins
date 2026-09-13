---
name: json-patch-preview
description: >
  Preview RFC6901 set and RFC6902 JSON Patch against pasted JSON on a copy —
  never writes files; zero-auth local only.
version: 1.0.0
tags: [json, patch, rfc6902, pointer, preview]
---

# JSON patch preview

When the user wants to preview mutations on pasted JSON without writing files:

1. For a single set, call **`json_pointer_set_preview`** with `jsonText`, `pointer`, and `value` (JSON-encoded string or typed). Use `/-` to append to arrays.
2. For multi-op changes, call **`json_patch_preview`** with `jsonText` + `patch` (RFC6902 ops: add, remove, replace, move, copy, test).
3. Return `{ok, resultJson}` (and `errors` on failure). Never claim a file was written.

## Example prompts

- "Preview setting /a/b to 99 on this JSON"
- "Apply this JSON Patch and show the result"
- "What would remove /empty look like?"
