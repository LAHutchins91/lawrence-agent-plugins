---
name: csv-split-join
description: >
  Split one CSV/TSV line into fields or join fields into a quoted line —
  zero-auth, local, string-level, no network.
version: 1.0.0
tags: [csv, split, join, fields, delimiter, local]
---

# CSV split / join (one line)

When the user asks to parse a single delimited line or rebuild a line from
fields:

1. Call **`csv_split_line`** with `line` + `delimiter` (optional `quote`)
   → `{fields[], fieldCount}`. Handles simple `"…"` fields and `""` doubling.
2. Call **`csv_join_fields`** with `fields` (array or JSON array string) +
   `delimiter` → `{line}`. Quotes when a field contains delimiter, quote, CR,
   or LF.

## Limits

Single line only (no multi-line quoted fields). Max line 64 KiB; max 4096
fields. Not a full file parser.

## Example prompts

- "Split this CSV line into columns"
- "Join these fields with a pipe delimiter"
- "Quote fields that contain commas"
