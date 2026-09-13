# Consul Lab

Zero-auth **local** MCP tools for **Consul** HCL/JSON text: service inventory, health-check hints, intention extraction, and educational lite lint. **String/regex** heuristics only — no consul CLI, no agent/cluster, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Consul** service workflows — service definitions (name/port/tags/kind), health checks (http/tcp/script/ttl/grpc), service intentions (allow/deny), plus quick smell heuristics without installing Consul or talking to an agent.

## Tools

| Tool | Purpose |
|------|---------|
| `consul_services_list` | HCL/JSON text → `{ services: [{name?, port?, tags?, kind?}], count }` |
| `consul_checks_hint` | Text → `{ checks: [{name?, type?, interval?}], count }` |
| `consul_intentions_hint` | Text → `{ intentions: [{source?, destination?, action?}], count }` |
| `consul_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **HCL/JSON string analysis only** — never runs `consul`, never talks to an agent/cluster, never opens paths on disk, never evaluates HCL expressions, never talks to a network.
- Not a Consul engine — complex nested Connect blocks, ACL policies, and catalog APIs may be under-parsed.
- Services: `service` / `service "name"` with `port`, `tags`, `kind` (HCL or JSON).
- Checks: http/tcp/script/ttl/grpc with `interval` / `timeout` hints.
- Intentions: source/destination/action (allow/deny), including `service-intentions` / JSON forms.
- Lint rules are educational heuristics (empty, missing service name, plaintext ACL tokens, allow-all intention tip, script check tip) — **not** an exploit guide.

## Start

```bash
node /workspace/consul-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/consul-lab`

## Skills

- **consul-services-checks** — service inventory + health-check hints
- **consul-intentions-lint** — intentions + lite lint

## License

MIT © Lawrence Hutchins
