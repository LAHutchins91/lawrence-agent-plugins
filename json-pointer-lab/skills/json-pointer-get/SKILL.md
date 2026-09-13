---
name: json-pointer-get
description: >
  Fetch values from pasted JSON by RFC6901 JSON Pointer (/foo/0/bar) and
  optionally flatten to dot-paths — zero-auth, local only, no network.
version: 1.0.0
tags: [json, pointer, rfc6901, flatten, query]
---

# JSON pointer get

When the user pastes JSON and wants a nested value or a flat path map:

1. Call **`json_pointer_get`** with `jsonText` + `pointer` (e.g. `/a/b/0`, empty string for root). Escapes: `~0` = `~`, `~1` = `/`.
2. Optionally call **`json_flatten`** to list all leaf paths as `a.b.0` style keys.
3. Report `{found, value, type}` or parse/pointer errors. Operate on pasted text only.

## Example prompts

- "Get /foo/0/bar from this JSON"
- "What is at pointer /m~0n/x~1y?"
- "Flatten this JSON to dot paths"
