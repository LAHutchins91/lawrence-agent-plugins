# Terracost Lab

Zero-auth **local** MCP tools for **Terracost** / terraform plan-cost *heuristics*: provider / region inventory (`aws` / `azurerm` / `google`), usage-assumption keys, plan JSON / plan-file refs (`resource_changes` types), and educational lite lint. **YAML / HCL / JSON text** analysis only — no terracost CLI, no cloud pricing API, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Terracost / terraform plan-cost config** workflows — provider/region inventory, usage YAML key extraction, plan JSON resource-type hints, plus quick smell heuristics without installing Terracost or calling a pricing API.

## Tools

| Tool | Purpose |
|------|---------|
| `terracost_providers_list` | Text → `{ providers: [{name?, region?}], count }` |
| `terracost_usage_hint` | Text → `{ usageKeys: string[], count }` |
| `terracost_plan_hint` | Text → `{ planPath?, resourceTypes: string[], changeCount? }` |
| `terracost_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **String / YAML / JSON heuristics only** — never runs `terracost` or `terraform`, never opens paths on disk, never evaluates expressions, never talks to a network or pricing API.
- Not a Terracost engine — nested / partial HCL and advanced plan filters may be under-parsed.
- Lint rules are educational heuristics (empty, missing provider, plaintext API/token key tip, missing plan file tip) — **not** an exploit guide. Secret *values* are never returned; only key *names* / presence hints.
- Never invents credentials.

## Start

```bash
node /workspace/terracost-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/terracost-lab`

## Skills

- **terracost-providers-usage** — provider / region inventory + usage-assumption keys
- **terracost-plan-lint** — plan JSON / plan-path hints + lite lint

## License

MIT © Lawrence Hutchins
