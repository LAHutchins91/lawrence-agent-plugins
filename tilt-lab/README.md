# Tilt Lab

Zero-auth **local** MCP tools for **Tiltfile** text: resource inventory, trigger/deps hints, extension/load detection, and educational lite lint. **Regex/string** heuristics only (Starlark-ish text) — no Tilt CLI, no cluster, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Tiltfile text** workflows — `docker_build`/`custom_build`, `k8s_yaml`/`k8s_resource`, `local_resource`, `dc_resource`/`docker_compose`, `resource_deps`/`deps`/`trigger_mode`, `load(` extensions, and quick smell heuristics without installing Tilt or talking to a cluster.

## Tools

| Tool | Purpose |
|------|---------|
| `tilt_resources_list` | Tiltfile text → `{ resources: [{kind, name?, image?}], count }` |
| `tilt_triggers_hint` | Tiltfile text → `{ triggers: [{resource?, deps?, resourceDeps?, triggerMode?}], count }` |
| `tilt_extensions_hint` | Tiltfile text → `{ extensions: [{path?, symbols?}], count }` |
| `tilt_lint_lite` | Tiltfile text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **Regex/string analysis only** — never runs `tilt`, never talks to a cluster, never opens paths on disk, never evaluates Starlark.
- Not a Starlark interpreter — nested/complex expressions may be under-parsed.
- Resources: `docker_build`, `custom_build`, `k8s_yaml`, `k8s_resource`, `local_resource`, `dc_resource`, `docker_compose`.
- Lint rules are educational heuristics (empty, missing docker_build/k8s_yaml, `:latest` tags, plaintext secret/password tip, remote git load tip, `allow_k8s_contexts` tip) — **not** an exploit guide.

## Start

```bash
node /workspace/tilt-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/tilt-lab`

## Skills

- **tilt-resources-triggers** — resource inventory + trigger/deps hints
- **tilt-extensions-lint** — extension/load detection + lite lint

## License

MIT © Lawrence Hutchins
