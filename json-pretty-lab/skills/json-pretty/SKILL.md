---
name: json-pretty
description: >
  Format, minify, or alphabetically sort keys in pasted JSON using local,
  zero-auth MCP tools with no network access.
version: 1.0.0
tags: [json, pretty, minify, sort, format, local]
---

# JSON pretty / minify / sort

Use these tools when the user wants pasted JSON normalized:

1. **`json_pretty`** with `text` and optional `indent` (default 2) to format JSON.
2. **`json_minify`** with `text` to remove nonessential whitespace.
3. **`json_sort_keys`** with `text`, optional `recursive` (default true), optional `compact` (default false), and optional `indent`.

Return tool errors directly when the JSON is invalid; do not try to silently repair it. All work is local. Inputs are limited to 1 MiB UTF-8.

## Example prompts

- "Pretty-print this JSON with four spaces."
- "Minify this payload."
- "Sort every object in this JSON by key and keep the output compact."
