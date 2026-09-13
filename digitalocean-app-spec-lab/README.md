# DigitalOcean App Spec Lab

Zero-auth **local** MCP tools for **DigitalOcean `.do/app.yaml` / App Spec YAML text**: services/workers/jobs/static_sites inventory, env keys (with scopes + secret-looking redaction), ingress/routes/domains hints, and heuristic lite lint. No DigitalOcean API. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **App Spec YAML** workflows — listing components/env keys/routes and educational smell heuristics without calling DigitalOcean.

## Tools

| Tool | Purpose |
|------|---------|
| `do_services_list` | App Spec text → `{ services, workers?, jobs?, static_sites?, count }` |
| `do_env_keys` | App Spec text → `{ keys, count, scopes?, redacted? }` |
| `do_routes_hint` | App Spec text → `{ ingress?, routes, domains?, alertrules_hint? }` |
| `do_lint_lite` | App Spec text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never calls DigitalOcean, never opens files on disk or over the network.
- Uses the `yaml` npm package (YAML 1.2). Not a full App Spec / `doctl` schema validator.
- Env tool returns **keys only** — secret-looking / `type: SECRET` values are never echoed (`redacted` lists those keys).
- Lint rules are educational heuristics (empty, missing name/region, plaintext secrets in envs, health_check tips) — **not** an exploit guide.

## Start

```bash
node /workspace/digitalocean-app-spec-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/digitalocean-app-spec-lab`

## Skills

- **do-services-env** — services/workers/jobs/static_sites + env keys
- **do-routes-lint** — routes/ingress/domains hints + lite lint

## License

MIT © Lawrence Hutchins
