# Bytes Size Lab

Zero-auth **local** MCP tools for byte-size parse, format, compare, and unit convert. Clear **IEC vs SI** rules — no SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on unambiguous byte-size algebra with explicit IEC (1024^n) vs SI (1000^n) rules and short-form binary preference.

## Tools

| Tool | Purpose |
|------|---------|
| `parse_bytes` | Parse `"1.5GiB"`, `"2MB"`, `"1g"` → `{ bytes, input }` |
| `format_bytes` | Format bytes as IEC (default) or SI → `{ formatted, bytes }` |
| `bytes_compare` | Compare two sizes (string\|number) → `{ aBytes, bBytes, cmp, relation }` |
| `unit_convert` | Convert between B/KiB…/TiB and B/KB…/TB → `{ value, from, to, bytes }` |

## Unit rules (caveats)

- **IEC** (`KiB`, `MiB`, `GiB`, `TiB`): **1024^n**
- **SI** (`KB`, `MB`, `GB`, `TB`): **1000^n**
- **Short / ambiguous** (`k`, `m`, `g`, `t`, e.g. `"1g"`): **binary preferred** → KiB/MiB/GiB/TiB
- So `"1g"` = 1 GiB = 1073741824 bytes; `"1GB"` = 1e9 bytes; `"1GiB"` = 1073741824 bytes
- `format_bytes` default style is **IEC**

## Start

```bash
node /workspace/bytes-size-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/bytes-size-lab`

## Skills

- **bytes-parse-format** — Parse and format with IEC/SI awareness
- **bytes-compare-convert** — Compare sizes and convert units

## License

MIT © Lawrence Hutchins
