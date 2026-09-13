---
name: bytes-compare-convert
description: Compare two byte sizes and convert between IEC/SI units with the local zero-auth bytes-size-lab MCP. No network.
version: 1.0.0
tags: [bytes, compare, convert, iec, si, developer-tools]
---

# Bytes compare & convert

When the user needs to compare sizes or convert units:

1. **`bytes_compare`** — `{ a, b }` (string or number) → `{ aBytes, bBytes, cmp, relation }`.
   - `cmp` is -1|0|1 (a relative to b); `relation` is smaller|equal|larger.
2. **`unit_convert`** — `{ value, from, to }` → `{ value, from, to, bytes }`.
   - Units: B, KiB, MiB, GiB, TiB (1024^n) and KB, MB, GB, TB (1000^n).

## Example prompts

- "Is 1GiB larger than 1000MB?"
- "Convert 2.5 GiB to MB"
- "Compare 512KiB and 500000"
