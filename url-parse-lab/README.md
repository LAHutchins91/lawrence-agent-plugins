# URL Parse Lab

Zero-auth **local** MCP tools for parsing URLs (WHATWG), joining relative paths against a base, normalizing default ports / query order, and redacting userinfo + secret query keys. No SaaS, no API keys, no network fetches.

## Why novel

No zero-auth local MCP in the catalog focuses on WHATWG URL parse/join/normalize plus defensive secret redaction for logs and sharing.

## Tools

| Tool | Purpose |
|------|---------|
| `url_parse` | WHATWG parse → `{ scheme, host, path, query, … }` |
| `url_join` | Resolve relative against base → `{ url }` |
| `url_normalize` | Drop default ports; optional sorted query |
| `url_redact` | Strip userinfo; redact secret query keys → `REDACTED` |

## Hard rules

- Uses Node / WHATWG `URL` only — no HTTP requests
- Redaction is for safe display/logging, not crypto

## Start

```bash
node /workspace/url-parse-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/url-parse-lab`

## Skills

- **url-parse-join** — Parse and join URLs
- **url-normalize-redact** — Normalize and redact secrets

## License

MIT © Lawrence Hutchins
