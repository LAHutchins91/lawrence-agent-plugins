# Heroku App JSON Lab

Zero-auth **local** MCP tools for scanning pasted Heroku `app.json` text: addons, env keys (values never echoed), formation, and lite lint. JSON-only (`JSON.parse`, with loose JSONC/trailing-comma strip when needed) — no Heroku API/CLI for tool logic, no deploy, no network.

This is **not** the Heroku CLI or Platform API. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `heroku_addons_list` | addons string/object → `{addons: [{planOrName}]}` |
| `heroku_env_keys` | env keys only (values redacted) → `{keys: [{key, required?, redacted}]}` |
| `heroku_formation_hint` | formation → `{formation: [{process, quantity?, size?}]}` |
| `heroku_lint_lite` | missing name/description, empty scripts, buildpacks present (info), success_url missing note → `{findings[]}` |

## Limits

- Pasted app.json text you already have. No sockets, DNS, remote fetches, Heroku API, or `heroku` CLI for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **JSON-only**: prefers `JSON.parse`; strips `//` / `/* */` and trailing commas loosely when plain parse fails.
- **Never echoes secret env values** — keys/required only; `redacted:true` when a value/generator was withheld.
- FREE MIT.

## Start

```bash
node /workspace/heroku-app-json-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/heroku-app-json-lab`

## Skills

- **heroku-addons** — list addons, env keys (redacted), and formation from pasted app.json
- **heroku-lint** — lite heuristic findings on pasted app.json

## License

MIT © Lawrence Hutchins — FREE
