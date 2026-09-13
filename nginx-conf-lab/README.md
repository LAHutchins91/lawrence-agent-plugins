# Nginx Conf Lab

Zero-auth **local** MCP tools for `nginx.conf` parse, listen ports, upstreams, and heuristic lint. **String-level** analysis only — no filesystem include follows, conf-path reads, or network I/O. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical nginx.conf **text** workflows — brace-aware server/location parse, listen/port extraction, upstream inventory, and quick lint smells without invoking `nginx -t` or reading include trees.

## Tools

| Tool | Purpose |
|------|---------|
| `nginx_parse_lite` | Conf text → `{ servers, notes? }` |
| `nginx_listen_ports` | Conf text → `{ listens, ports }` |
| `nginx_upstream_list` | Conf text → `{ upstreams }` |
| `nginx_conf_lint` | Conf text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never opens include paths, never runs `nginx -t`, never binds ports or resolves upstream DNS.
- Heuristic brace-aware parser — **not** a full nginx grammar; nested `if` / complex maps may be approximate.
- `include` directives are noted but **not** expanded.
- Lint rules are heuristics (missing semicolon smells, empty `server_name`, duplicate locations, unbalanced braces, root+alias confusion).

## Start

```bash
node /workspace/nginx-conf-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/nginx-conf-lab`

## Skills

- **nginx-parse-listen** — Parse server/location blocks and extract listen ports
- **nginx-upstream-lint** — List upstreams and run heuristic conf lint

## License

MIT © Lawrence Hutchins
