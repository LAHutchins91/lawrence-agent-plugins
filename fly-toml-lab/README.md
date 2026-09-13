# Fly TOML Lab

Zero-auth **local** MCP tools for scanning pasted `fly.toml` text: app name / primary region, services & http_service ports, `[env]` keys (secret-like values redacted), and lite lint. Lite TOML subset (same family as cargo-toml-lab / netlify-toml-lab / ini-toml-lite) — no flyctl for tool logic, no deploy, no network.

This is **not** the Fly.io CLI. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `fly_app_name` | `app` / `primary_region` → `{app?, primaryRegion?}` |
| `fly_services_ports` | `[[services]]` / `[http_service]` ports → `[{kind, ports[]}]` |
| `fly_env_keys` | `[env]` keys → keys + values with secret-like redacted |
| `fly_lint_lite` | missing `app`, missing services/http_service, `force_https` false note, VM size present (info) → `{findings[]}` |

## Limits

- Pasted fly.toml text you already have. No sockets, DNS, remote fetches, or flyctl for tool logic (`flyctl` / `fly` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite TOML only** — not a full TOML 1.0 parser. Supported: bare/quoted/dotted keys; basic and literal strings (including multiline); integers and floats; booleans; arrays; inline tables; `[tables]`; `[[arrays of tables]]`; `#` comments. Not supported / incomplete: hex/oct/bin integers, ±inf/nan, native date-times (ISO-ish kept as strings), strict array homogeneity, table-redefinition / dotted-key merge edge cases, and other TOML 1.0 corner cases.
- Never echoes secret-like `[env]` values (PASSWORD, SECRET, TOKEN, API_KEY, KEY, … → `***REDACTED***`).
- Does not deploy, scale, or talk to Fly API.
- FREE MIT.

## Start

```bash
node /workspace/fly-toml-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/fly-toml-lab`

## Skills

- **fly-services** — list app/region, service ports, and env keys from pasted fly.toml
- **fly-lint** — lite heuristic findings on pasted fly.toml

## License

MIT © Lawrence Hutchins — FREE
