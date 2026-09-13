# Nomad Lab

Zero-auth **local** MCP tools for **Nomad** job HCL text: job inventory, group/network hints, task/driver/image extraction, and educational lite lint. **String/regex** heuristics only — no nomad CLI, no cluster, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Nomad** job workflows — `job`/`group`/`task` blocks (service/batch/system), datacenters/namespace, docker/exec/java drivers, network ports, plus quick smell heuristics without installing Nomad or talking to a cluster.

## Tools

| Tool | Purpose |
|------|---------|
| `nomad_jobs_list` | HCL text → `{ jobs: [{id?, type?, datacenters?, namespace?}], count }` |
| `nomad_groups_hint` | Text → `{ groups: [{name?, count?, networks?}], count }` |
| `nomad_tasks_hint` | Text → `{ tasks: [{name?, driver?, image?}], secretKeyNames?, count }` |
| `nomad_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL string analysis only** — never runs `nomad`, never talks to a cluster, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- Not a Nomad engine — complex nested blocks, dynamic jobs, and Vault/CSI wiring may be under-parsed.
- Jobs: `job "name"` with `type`, `datacenters`, `namespace`.
- Groups: name, `count`, nested `network` / `port` hints.
- Tasks: name, `driver`, docker `image`, secret-like **env key names** only (not values).
- Lint rules are educational heuristics (empty, missing job/task, `:latest` images, privileged/host network tip, plaintext secrets) — **not** an exploit guide.

## Start

```bash
node /workspace/nomad-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/nomad-lab`

## Skills

- **nomad-jobs-groups** — job inventory + group/network hints
- **nomad-tasks-lint** — task/driver/image hints + lite lint

## License

MIT © Lawrence Hutchins
