# Cypress Config Lab

Zero-auth **local** MCP tools for **Cypress config text**: extract `e2e` / `component` blocks, list `env` keys (with light secret redaction), and heuristic lite lint. No `cypress` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Cypress config text** workflows — e2e/component inventory, env key listing, and quick educational smell heuristics without invoking Cypress.

## Tools

| Tool | Purpose |
|------|---------|
| `cy_e2e_summary` | Cypress config text → `{ e2e?, keys }` |
| `cy_component_summary` | Cypress config text → `{ component?, keys }` |
| `cy_env_keys` | Cypress config text → `{ env, keys, count }` |
| `cy_lint_lite` | Cypress config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `cypress`, never opens files on disk or over the network.
- Prefer **JSON/JSONC**. `cypress.config.js` / `.ts` text uses **defineConfig unwrap + best-effort regex heuristics (no eval)** — spreads, computed keys, `require()`, and `setupNodeEvents` bodies are not resolved.
- `cy_env_keys` redacts obvious secret-looking values to `[REDACTED]` but still lists keys.
- Lint rules are educational heuristics (empty config, missing e2e+component, `chromeWebSecurity: false`, video/screenshot tips, hardcoded secrets, deprecated `integrationFolder` / `testFiles` / `pluginsFile`, JS heuristic limits) — **not** an exploit guide.

## Start

```bash
node /workspace/cypress-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cypress-config-lab`

## Skills

- **cy-e2e-component** — e2e / component summary
- **cy-env-lint** — env keys + lite lint

## License

MIT © Lawrence Hutchins
