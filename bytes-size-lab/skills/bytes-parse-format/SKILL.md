---
name: bytes-parse-format
description: >
  Parse human byte-size strings and format byte counts with the local zero-auth
  bytes-size-lab MCP. IEC (1024^n) vs SI (1000^n); short k/m/g prefer binary.
version: 1.0.0
tags: [bytes, iec, si, parse, format, developer-tools]
---

# Bytes parse & format

When the user needs to parse or display byte sizes **with clear IEC vs SI rules**:

1. **`parse_bytes`** — `{ input: string }` → `{ bytes, input }`.
   - `KiB/MiB/GiB/TiB` = 1024^n; `KB/MB/GB/TB` = 1000^n; short `1g`/`1m`/`1k` → binary.
2. **`format_bytes`** — `{ bytes, style?: "iec"|"si" }` → `{ formatted, bytes }`.
   - Default **IEC** (`KiB`/`MiB`/`GiB`).

## Example prompts

- "How many bytes is 1.5GiB?"
- "Parse 2MB vs 2MiB"
- "Format 1536 as IEC"
- "What does 1g mean in bytes?"
