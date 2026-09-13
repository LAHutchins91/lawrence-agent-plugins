---
name: jsonl-slice-array
description: Slice JSONL windows and convert to capped arrays with the local zero-auth jsonl-lab MCP. Default slice limit 50 (max 500); to_array 200k bytes / 1000 lines.
version: 1.0.0
tags: [jsonl, slice, array, ndjson, developer-tools]
---

# JSONL slice & to-array

When the user needs a window of raw lines or a parsed array:

1. **`jsonl_slice`** — `{ text, start?, limit? }` → `{ lines, start, count }`.
   - `start` is **0-based**; default `limit` **50**, hard max **500**.
2. **`jsonl_to_array`** — `{ text, maxBytes?, maxLines? }` → `{ items, truncated?, note? }`.
   - Defaults: **200_000** bytes, **1000** lines; oversized → truncate + note.

## Example prompts

- "Show the first 20 lines of this JSONL"
- "Slice lines 100–150"
- "Parse this NDJSON into an array (safely capped)"
