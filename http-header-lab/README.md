# HTTP Header Lab

Zero-auth **local** MCP tools for HTTP header parse, Cache-Control explain, Content-Disposition parse, and Forwarded / X-Forwarded-*. Header string analysis only — no network I/O. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical HTTP header-block analysis — parse raw `Name: value` lines (fold/duplicates), explain Cache-Control directives, split Content-Disposition filenames (including RFC 5987 `filename*`), and walk RFC 7239 Forwarded plus the X-Forwarded-* family.

## Tools

| Tool | Purpose |
|------|---------|
| `headers_parse` | Raw header block → `{ headers, keys }` (lowercase map; original names in `keys`) |
| `cache_control_explain` | Cache-Control value → `{ directives, notes }` |
| `content_disposition_parse` | Content-Disposition → `{ type, filename?, filenameStar?, params }` |
| `forwarded_parse` | Forwarded / X-Forwarded-* → `{ hops?, for?, proto?, host?, notes }` |

## Caps & caveats

- **String analysis only** — no sockets, DNS, or HTTP client; input is text you already have.
- Header folding follows obs-fold (leading SP/HTAB continues the previous field).
- Duplicate field names become arrays in `headers`; `keys` lists each original name once (first seen).
- Request/status lines without `:` are skipped.
- Cache-Control notes cover common directives; unknown tokens are flagged, not rejected.
- `filename*` decoding is RFC 5987 (`charset'lang'percent-encoded`); malformed percent-escapes are left as-is.
- Forwarded hop order is left-to-right as written; leftmost `for` is typically the original client.
- X-Forwarded-* is untrusted client/proxy text — this tool does not validate hops or spoofing.

## Start

```bash
node /workspace/http-header-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/http-header-lab`

## Skills

- **header-parse-cache** — Parse raw header blocks and explain Cache-Control
- **disposition-forwarded** — Parse Content-Disposition and Forwarded / X-Forwarded-*

## License

MIT © Lawrence Hutchins
