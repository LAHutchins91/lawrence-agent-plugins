---
name: csv-schema-check
description: "Infer and validate CSV schemas from pasted text, and diff headers between two CSVs — zero-auth, no network, no external CSV libraries."
version: 1.0.0
tags: [csv, schema, validation, headers, data-quality]
---

# CSV schema check

When the user pastes CSV (or asks whether columns/types/headers match):

1. Call **`csv_infer_schema`** with `csvText` to get types, nullability, and sampleCounts.
2. Call **`csv_validate`** with the same paste; pass an optional `schema` array of `{name, type, nullable?}` when they have a contract. If omitted, the tool infers then checks consistency. Report `rowErrors` — do not stop at the first bad cell.
3. To compare two exports, call **`csv_diff_headers`** with `csvTextA`/`csvTextB` or `headersA`/`headersB`.

Summarize column types, nullability, validation counts, and header-only/order changes. Operate on pasted text only.

## Example prompts

- "Infer the schema for this CSV paste"
- "Validate these rows against id:number, email:string nullable"
- "Diff headers between yesterday's and today's export"
