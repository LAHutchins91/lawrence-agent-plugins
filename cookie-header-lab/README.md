# Cookie Header Lab

Zero-auth **local** MCP tools for parsing pasted `Cookie` / `Set-Cookie` header text, educational attribute notes, and value redaction. String analysis only — no network, no browser access, no cookie theft.

## Tools

| Tool | Purpose |
|------|---------|
| `cookie_parse` | Cookie request header → `[{name, value}]` pairs (`; `-separated) |
| `set_cookie_parse` | Set-Cookie (newline-separated ok) → `{name, value, attributes}` |
| `cookie_explain` | Parsed cookie or raw Set-Cookie → educational HttpOnly/Secure/SameSite/Path/Domain notes |
| `cookie_redact` | Mask cookie values; keep names + attribute keys. **Never echoes original secret values** |

## Limits

- Pasted header text you already have. No sockets, DNS, browser injection, or capture.
- Cookie request headers do not carry HttpOnly/Secure/SameSite — those live on `Set-Cookie`.
- Explain notes are educational heuristics, not a security audit or pentest report.
- `cookie_redact` reconstructs output from names/attributes only; secret values are replaced with `[REDACTED]`.
- Inputs are length-limited (header text ≤ 65536 chars).

## Start

```bash
node /workspace/cookie-header-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cookie-header-lab`

## Skills

- **cookie-parse** — parse Cookie / Set-Cookie text and redact values
- **cookie-explain** — educational notes on cookie attribute implications

## License

MIT © Lawrence Hutchins — FREE
