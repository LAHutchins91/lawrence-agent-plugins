# Querystring Lab

Zero-auth **local** MCP tools for parsing, stringifying, merging, and diffing URL query strings. No SaaS product, no API keys — everything runs on stdio via Node `URLSearchParams` and hand-rolled encode/decode.

## Why novel

No zero-auth local MCP in the catalog focuses on query-string parse + stringify + merge + structured diff in one stdio server with duplicate-key arrays and null/undefined skipping.

## Tools

| Tool | Purpose |
|------|---------|
| `qs_parse` | Parse query string (with/without `?`) → `{ params, keys }` (dup keys → arrays) |
| `qs_stringify` | Object → encoded query string; skip null/undefined; arrays as repeated keys |
| `qs_merge` | Merge overrides onto base (overrides win); strings or objects |
| `qs_diff` | Diff two query maps → `{ added, removed, changed, unchangedKeys }` |

## Start

```bash
node /workspace/querystring-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/querystring-lab`

## Skills

- **qs-parse-stringify** — Parse and stringify query strings
- **qs-merge-diff** — Merge overrides and diff query maps

## License

MIT © Lawrence Hutchins
