# Waypoint Lab

Zero-auth **local** MCP tools for **HashiCorp Waypoint** HCL (`waypoint.hcl`) *heuristics*: app inventory (name/labels), build/use + registry hints, deploy/release hints, and educational lite lint. **String/regex** heuristics only — no waypoint CLI, no deploy, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Waypoint** config workflows — `app` blocks, `build`/`use` (docker, pack, …) + registry, `deploy`/`release` (kubernetes, nomad, docker, helm), plus quick smell heuristics without installing Waypoint or talking to a runner.

## Tools

| Tool | Purpose |
|------|---------|
| `waypoint_apps_list` | HCL text → `{ apps: [{name?, labels?}], count }` |
| `waypoint_builds_hint` | Text → `{ builds: [{app?, use?, registry?}], count }` |
| `waypoint_deploys_hint` | Text → `{ deploys: [{app?, use?}], releases?: string[], count }` |
| `waypoint_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL string analysis only** — never runs `waypoint`, never deploys, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- **Never invents or decodes credentials** — flags key *names* only (e.g. a plaintext `env` / secret attribute), never secret values.
- Not a Waypoint engine — complex nested modules, dynamic functions (`gitrefpretty()`), and remote runners may be under-parsed.
- Lint rules are educational heuristics (empty, missing app/build/deploy, `:latest` images, plaintext secrets/env) — **not** an exploit guide.

## Start

```bash
node /workspace/waypoint-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/waypoint-lab`

## Skills

- **waypoint-apps-builds** — app inventory (name/labels) + build/use + registry hints
- **waypoint-deploys-lint** — deploy/release hints + lite lint

## License

MIT © Lawrence Hutchins
