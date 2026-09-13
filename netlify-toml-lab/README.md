# Netlify TOML Lab

Zero-auth **local** MCP tools for scanning pasted `netlify.toml` text: redirects, headers hints, build command/publish, and lite lint. Lite TOML subset (same family as cargo-toml-lab / ini-toml-lite / pyproject-lab) — no Netlify CLI for tool logic, no deploy, no network.

This is **not** the Netlify CLI. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `netlify_redirects_list` | `[[redirects]]` → `{redirects: [{from, to, status?, force?}]}` |
| `netlify_headers_hint` | `[[headers]]` → `{headers: [{for, headerKeys[]}]}` |
| `netlify_build_command` | `[build]` → `{command?, publish?, functions?, environmentKeys?}` |
| `netlify_lint_lite` | missing `[build].publish`, SPA `/*` → `/index.html` note, empty redirects, plugins present (info) → `{findings[]}` |

## Limits

- Pasted netlify.toml text you already have. No sockets, DNS, remote fetches, or Netlify CLI for tool logic (`netlify` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite TOML only** — not a full TOML 1.0 parser. Supported: bare/quoted/dotted keys; basic and literal strings (including multiline); integers and floats; booleans; arrays; inline tables; `[tables]`; `[[arrays of tables]]`; `#` comments. Not supported / incomplete: hex/oct/bin integers, ±inf/nan, native date-times (ISO-ish kept as strings), strict array homogeneity, table-redefinition / dotted-key merge edge cases, and other TOML 1.0 corner cases.
- Does not install or execute `[[plugins]]`, resolve `_redirects` files, or deploy.
- FREE MIT.

## Start

```bash
node /workspace/netlify-toml-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/netlify-toml-lab`

## Skills

- **netlify-redirects** — list redirects, headers, and build hints from pasted netlify.toml
- **netlify-lint** — lite heuristic findings on pasted netlify.toml

## License

MIT © Lawrence Hutchins — FREE
