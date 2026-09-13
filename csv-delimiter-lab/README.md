# CSV Delimiter Lab

Zero-auth **local** MCP tools for CSV/TSV delimiter detection, quote/escape sniffing, and simple field split/join. No network — pasted sample/line text only. Pure TypeScript string helpers (no heavy CSV/YAML deps).

## Why novel

A focused delimiter companion for agents dealing with messy exports (comma vs tab vs semicolon vs pipe), quote styles, and one-line field round-trips without pulling in a full spreadsheet parser.

## Tools

| Tool | Purpose |
|------|---------|
| `detect_delimiter` | Sample → `{delimiter, name, confidence, scores, …}` |
| `csv_sniff` | Sample → `{quoteChar, escapeStyle, …}` (`""` doubling vs `\`) |
| `csv_split_line` | One line + delimiter → `{fields[], fieldCount}` |
| `csv_join_fields` | `fields[]` + delimiter → `{line}` with quoting when needed |

## Limits

- Max sample size: **256 KiB** UTF-8 (`detect_delimiter`, `csv_sniff`).
- Max line size: **64 KiB**; max fields: **4096**.
- **String-level only** — not a full RFC4180 file parser.
- No multi-line quoted fields; no encoding detection; no type inference.
- Delimiter candidates for detection: comma, tab, semicolon, pipe.
- Split/join support simple `"` quoting with `""` doubling.

## Start

```bash
node /workspace/csv-delimiter-lab/dist/bundle.js
```

## Skills

- **detect-delimiter** — pick comma/tab/semicolon/pipe and sniff quote style
- **csv-split-join** — split one line into fields or join fields into a line

## License

MIT © Lawrence Hutchins — FREE
