---
name: json-stats
description: "Inspect the depth, key count, container counts, value type counts, and string length of pasted JSON locally with no authentication or network."
version: 1.0.0
tags: [json, stats, structure, count, depth, local]
---

# JSON structural statistics

Call **`json_stats`** with pasted JSON in `text` when the user asks about payload shape or complexity.

The result contains:

- `depth` — maximum tree depth, with the root at 0
- `keyCount` — total object properties; array indices are excluded
- `arrayCount` and `objectCount` — arrays and non-array objects
- `typeCounts` — counts for null, boolean, number, string, array, and object values
- `stringLength` — UTF-16 code units across string values, excluding key names

Invalid JSON is an error. Maximum input is 1 MiB UTF-8. All work is local.

## Example prompts

- "How deeply nested is this JSON?"
- "Count the objects, arrays, keys, and value types in this payload."
