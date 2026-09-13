# Railway JSON Lab

Zero-auth **local** MCP tools for **railway.json / railway.toml text**: services inventory, env/variable keys (with secret-looking redaction), deploy/build field hints, and heuristic lite lint. No Railway API. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **railway.json / railway.toml** workflows — listing services/env keys/deploy fields and educational smell heuristics without calling Railway.

## Tools

| Tool | Purpose |
|------|---------|
| `railway_services_list` | config text → `{ services, count }` |
| `railway_env_keys` | config text → `{ keys, count, redacted? }` |
| `railway_deploy_hint` | config text → `{ buildCommand?, startCommand?, watchPatterns?, numReplicas?, healthcheckPath?, restartPolicyType? }` |
| `railway_lint_lite` | config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never calls Railway, never opens files on disk or over the network.
- Prefers JSON / JSONC; also light TOML heuristics (not a full TOML 1.0 / Railway schema validator).
- Env tool returns **keys only** — secret-looking values are never echoed (`redacted` lists those keys).
- Lint rules are educational heuristics (empty, missing start/build, hardcoded secrets in env, Dockerfile vs Nixpacks tips) — **not** an exploit guide.

## Start

```bash
node /workspace/railway-json-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/railway-json-lab`

## Skills

- **railway-services-env** — services list + env keys
- **railway-deploy-lint** — deploy/build hints + lite lint

## License

MIT © Lawrence Hutchins
