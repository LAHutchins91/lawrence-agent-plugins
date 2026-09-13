# Infracost Lab

Zero-auth **local** MCP tools for **Infracost** YAML *heuristics*: project inventory (`path` / `name` / `terraform_var_files`), usage-file resource keys, currency / timezone / pricing-API *key-name* hints, and educational lite lint. **YAML string** analysis only — no infracost CLI, no cloud pricing API, no network, no filesystem follow, no eval. No SaaS.

## Why novel

No zero-auth local MCP in this packaging focuses on practical **Infracost config** workflows — project path/var-file inventory, usage YAML key extraction, currency/timezone hints, plus quick smell heuristics without installing Infracost or calling a pricing API.

## Tools

| Tool | Purpose |
|------|---------|
| `infracost_projects_list` | YAML text → `{ projects: [{path?, name?, varFiles?}], count }` |
| `infracost_usage_hint` | Text → `{ usageKeys: string[], resources?: string[], count }` |
| `infracost_currency_hint` | Text → `{ currency?, timezone?, hasApiKeyRef?: boolean }` |
| `infracost_lint_lite` | Text → `{ findings:[{severity,rule,advice}], findingCount }` |

## Caps & caveats

- **YAML string analysis only** — never runs `infracost`, never opens paths on disk, never evaluates expressions, never talks to a network or pricing API.
- Not an Infracost engine — nested / partial YAML and advanced project filters may be under-parsed.
- Lint rules are educational heuristics (empty, missing projects, plaintext API key tip, missing usage file tip) — **not** an exploit guide. API key *values* are never returned; only key *names* / presence hints.
- Never invents credentials.

## Start

```bash
node /workspace/infracost-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/infracost-lab`

## Skills

- **infracost-projects-usage** — project inventory + usage-file / resource usage keys
- **infracost-currency-lint** — currency / timezone / API-key-ref hints + lite lint

## License

MIT © Lawrence Hutchins
