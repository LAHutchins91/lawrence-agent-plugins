---
name: qs-parse-stringify
description: Parse URL query strings (duplicate keys → arrays) and stringify objects back to encoded query strings with the local zero-auth querystring-lab MCP.
version: 1.0.0
tags: [querystring, parse, stringify, url, developer-tools]
---

# Parse & stringify query strings

When the user needs to parse or build a query string:

1. **`qs_parse`** — `{ input }` → `{ params, keys }`. Leading `?` optional. Duplicate keys become `string[]`.
2. **`qs_stringify`** — `{ params }` → `{ query }` (no leading `?`). Skips `null`/`undefined`; encodes keys/values with `encodeURIComponent`; arrays emit repeated keys.

## Example prompts

- "Parse ?foo=1&foo=2&bar=hi"
- "Stringify { a: 1, tags: ['x','y'] } as a query string"
