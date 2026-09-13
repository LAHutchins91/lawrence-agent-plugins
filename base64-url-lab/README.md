# Base64 URL Lab

Zero-auth **local** MCP tools for Base64 / Base64URL encode & decode, URL encode & decode (`encodeURI` / `encodeURIComponent`), and safe JWT header/payload inspection (split + decode only — **no signature verify**, secret-like claims redacted). No SaaS product, no API keys — everything runs on stdio via Node.

## Why novel

No zero-auth local MCP in the catalog combines Base64/URL codecs with JWT part inspection that redacts secret-like claims and refuses dumping huge binary payloads.

## Tools

| Tool | Purpose |
|------|---------|
| `b64_encode` | Standard or URL-safe Base64 encode |
| `b64_decode` | Strict decode with maxChars / binary guard |
| `url_encode` | `encodeURIComponent` or `encodeURI` |
| `url_decode` | Matching URL decode |
| `jwt_parts` | Split JWT; decode header+payload JSON; redact secrets |

## Start

```bash
node /workspace/base64-url-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/base64-url-lab`

## Skills

- **b64-url-codec** — Base64 and URL encode/decode workflows
- **jwt-inspect** — Inspect JWT header/payload without verifying signatures

## License

MIT © Lawrence Hutchins
