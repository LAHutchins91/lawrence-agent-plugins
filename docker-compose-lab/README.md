# Docker Compose Lab

Zero-auth **local** MCP tools for docker-compose **YAML text**: list services, map ports, extract environment keys, and heuristic lite lint. **String-level** analysis only — no docker daemon, no filesystem compose reads beyond the text you pass, no network I/O. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **compose YAML text** workflows — service inventory, ports map, env key extraction (values redacted), and quick risk/smell heuristics without talking to Docker or opening files on disk.

## Tools

| Tool | Purpose |
|------|---------|
| `compose_list_services` | compose YAML text → `{ services, count, version? }` |
| `compose_ports_map` | compose YAML text → `{ ports: [{service, published?, target?, protocol?, raw}] }` |
| `compose_env_keys` | compose YAML text → `{ services: [{name, envKeys}] }` (keys only; env_file paths as strings) |
| `compose_lint_lite` | compose YAML text → `{ findings, findingCount }` |

## Caps & caveats

- **YAML string analysis only** — never runs `docker compose`, never opens compose paths on disk, never invents env_file contents.
- Parses Compose v2/v3-style documents (`services:`, optional top-level `version`).
- Port strings support common short forms (`"8080:80"`, `"127.0.0.1:8080:80/tcp"`, target-only) and long-form maps.
- Env: returns **keys only** from inline `environment` maps/lists; `env_file` entries are listed as reference strings (not file contents).
- Lint rules are heuristics (missing image/build, host network, privileged, duplicate service names, invalid ports format, etc.).

## Start

```bash
node /workspace/docker-compose-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/docker-compose-lab`

## Skills

- **compose-services-ports** — List services and extract ports mappings
- **compose-env-lint** — Env keys (redacted values) and lite compose lint

## License

MIT © Lawrence Hutchins
