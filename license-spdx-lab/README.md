# License SPDX Lab

Zero-auth **local** MCP tools for curated SPDX lookup, fuzzy alias normalization, heuristic license-compatibility hints, and short file-header suggestions. No network and no authentication.

## Tools

| Tool | Purpose |
|------|---------|
| `spdx_lookup` | Curated SPDX id → `{id, name, osi, notes, urlHint, family}` |
| `spdx_normalize` | Fuzzy/alias text → canonical SPDX id + confidence |
| `license_compat_hint` | Two SPDX ids → heuristic compatibility note (**NOT legal advice**) |
| `license_header_suggest` | SPDX id + optional year/holder → short file header (copyleft = SPDX line + pointer) |

## Limits

- Curated common set (~30–40 ids), **not** the full SPDX license list.
- No network; `urlHint` values are documentation pointers only.
- Compatibility notes are **heuristics**, not legal advice, counsel, or a compliance engine.
- Headers never dump full GPL/AGPL license text.
- Inputs are length-limited (ids/text ≤ 400 chars).

## Start

```bash
node /workspace/license-spdx-lab/dist/bundle.js
```

## Skills

- **spdx-lookup** — resolve or normalize common SPDX identifiers
- **license-header** — suggest a short SPDX file header comment

## License

MIT © Lawrence Hutchins — FREE
