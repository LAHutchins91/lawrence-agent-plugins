# CSV Schema Guard

Zero-auth **local** MCP tools for pasted CSV text: infer column schemas, validate rows (collecting per-cell findings), diff headers, and heuristically scan for PII-like columns with **masked samples only**. No network, no file I/O beyond stdio — paste text in, get structured JSON out.

## Why novel

No zero-auth local MCP in the catalog specializes in RFC4180-ish CSV schema inference + validation + header diffs + PII masking without cloud uploads or external CSV libraries.

## Tools

| Tool | Purpose |
|------|---------|
| `csv_infer_schema` | CSV → columns with types (`string`/`number`/`boolean`/`date`/`empty`), nullability, sampleCounts |
| `csv_validate` | CSV + optional schema → `rowErrors[{row, column, issue}]` + summary (infer-then-validate if no schema) |
| `csv_diff_headers` | Two CSVs or header strings → `onlyInA` / `onlyInB` / `shared` / `orderChanged` |
| `csv_pii_scan` | Heuristic email/phone/ssn columns → masked samples only (never raw PII) |

## Start

```bash
node /workspace/csv-schema-guard/dist/bundle.js
```

## Skills

- **csv-schema-check** — infer + validate + header diff workflows
- **csv-pii-review** — PII column review via `csv_pii_scan` (masks only)

## License

MIT © Lawrence Hutchins
