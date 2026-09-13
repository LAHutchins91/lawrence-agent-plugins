# Render YAML Lab

Zero-auth **local** MCP tools for scanning pasted `render.yaml` Blueprint text: services list, `envVars` keys (secret values redacted), `healthCheckPath` hints, and lite lint. Uses the `yaml` npm package — no Render API, no deploy, no network.

This is **not** the Render CLI or dashboard. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `render_services_list` | `services:` → `[{name, type?, env?, plan?}]` |
| `render_env_keys` | `envVars` keys → `[{key, redacted?}]` (never echoes secret values) |
| `render_healthcheck_hint` | `healthCheckPath` / `healthcheck` → `[{service, path?}]` |
| `render_lint_lite` | missing services, web without healthCheckPath, buildCommand missing, autoDeploy false (info) → `{findings[]}` |

## Limits

- Pasted render.yaml text you already have. No sockets, DNS, remote fetches, or Render API for tool logic.
- Input capped at ~1MB (`1048576` characters).
- Uses the **`yaml`** package (YAML 1.2). Not a full Render Blueprint schema validator.
- Never echoes secret-like `envVars` plaintext values (PASSWORD, SECRET, TOKEN, API_KEY, KEY, … → `redacted: true` only; no value field).
- Does not deploy, sync env, or talk to Render API.
- FREE MIT.

## Start

```bash
node /workspace/render-yaml-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/render-yaml-lab`

## Skills

- **render-services** — list services, env keys, and healthcheck paths from pasted render.yaml
- **render-lint** — lite heuristic findings on pasted render.yaml

## License

MIT © Lawrence Hutchins — FREE
