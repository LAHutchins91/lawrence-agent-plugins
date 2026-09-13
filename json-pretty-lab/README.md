# JSON Pretty Lab

Zero-auth **local** MCP tools for formatting, minifying, alphabetically sorting keys, and measuring pasted JSON. No network and no authentication. The implementation uses TypeScript with the platform `JSON.parse` / `JSON.stringify` APIs.

## Tools

| Tool | Purpose |
|------|---------|
| `json_pretty` | Parse JSON text and return an indented string (default indent: 2) |
| `json_minify` | Parse JSON text and return compact JSON |
| `json_sort_keys` | Sort object keys alphabetically, recursively by default; pretty or compact output |
| `json_stats` | Return depth, key/array/object counts, per-type counts, and total string-value length |

All tools reject invalid JSON and input larger than **1 MiB UTF-8**. `indent` is an integer from 0 through 10. Stats define the root depth as 0, count object keys (not array indices), and count string value lengths in UTF-16 code units (not key lengths).

## Start

```bash
node /workspace/json-pretty-lab/dist/bundle.js
```

## Skills

- **json-pretty** — format, minify, or deterministically sort pasted JSON
- **json-stats** — inspect JSON structure without exposing it to a network service

## License

MIT © Lawrence Hutchins — FREE
