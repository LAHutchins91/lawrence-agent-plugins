# Supabase Config Lab

Zero-auth **local** MCP tools for scanning pasted `supabase/config.toml` text: project id / API & Studio ports, `[db]` keys (password-like redacted), `[auth]` signup / site_url / redirect summary, and lite lint. Lite TOML subset (same family as fly-toml-lab / netlify-toml-lab / cargo-toml-lab / ini-toml-lite) — no Supabase CLI for tool logic, no Management API, no network.

This is **not** the Supabase CLI. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `supabase_project_hint` | `project_id` / `api.port` / `studio.port` → `{projectId?, apiPort?, studioPort?}` |
| `supabase_db_keys` | `[db]` keys → `[{key, redacted?}]` (password-like flagged; values never echoed) |
| `supabase_auth_hint` | `[auth]` `enable_signup` / `site_url` / `additional_redirect_urls` → `{enableSignup?, siteUrl?, redirectCount?}` |
| `supabase_lint_lite` | missing `project_id`, auth `site_url` missing, `db.major_version` present (info), storage enabled note → `{findings[]}` |

## Limits

- Pasted supabase/config.toml text you already have. No sockets, DNS, remote fetches, or supabase CLI for tool logic (`supabase` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **Lite TOML only** — not a full TOML 1.0 parser. Supported: bare/quoted/dotted keys; basic and literal strings (including multiline); integers and floats; booleans; arrays; inline tables; `[tables]`; `[[arrays of tables]]`; `#` comments. Not supported / incomplete: hex/oct/bin integers, ±inf/nan, native date-times (ISO-ish kept as strings), strict array homogeneity, table-redefinition / dotted-key merge edge cases, and other TOML 1.0 corner cases.
- Never echoes password-like `[db]` values (PASSWORD, SECRET, TOKEN, KEY, … → flagged `redacted: true`, values omitted).
- Does not start local stack, talk to Supabase API, or manage projects.
- FREE MIT.

## Start

```bash
node /workspace/supabase-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/supabase-config-lab`

## Skills

- **supabase-auth** — summarize Auth signup / site_url / redirects from pasted config.toml
- **supabase-lint** — lite heuristic findings on pasted config.toml

## License

MIT © Lawrence Hutchins — FREE
