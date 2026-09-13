# JSONL Lab

Zero-auth **local** MCP tools for JSON Lines validate, count, slice, and to-array. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical JSONL inspection — per-line validate with excerpts, capped slice, and safe to-array with byte/line caps.

## Tools

| Tool | Purpose |
|------|---------|
| `jsonl_validate` | Parse each non-empty line as JSON → `{ ok, lineCount, errorCount, errors }` |
| `jsonl_count` | Count lines / non-empty / valid+invalid JSON → `{ lines, nonEmpty, validJson?, invalidJson? }` |
| `jsonl_slice` | 0-based window of raw lines → `{ lines, start, count }` (default limit 50, max 500) |
| `jsonl_to_array` | Parse lines into `items[]` with byte/line caps → `{ items, truncated?, note? }` |

## Caps & caveats

- Empty lines are skipped for validate / to_array JSON parsing (still counted in `jsonl_count`).
- `jsonl_slice` `start` is **0-based**; default `limit` **50**, hard max **500**.
- `jsonl_to_array` defaults: `maxBytes` **200_000**, `maxLines` **1000**; oversized input is truncated with `truncated`/`note` (or refused with a clear error when appropriate).
- Line numbers in errors are **1-based** (file line index).

## Start

```bash
node /workspace/jsonl-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/jsonl-lab`

## Skills

- **jsonl-validate-count** — Validate and count JSONL
- **jsonl-slice-array** — Slice windows and convert to arrays safely

## License

MIT © Lawrence Hutchins
