# Cypress Commands Lab

Zero-auth **local** MCP tools for **Cypress support/commands JS/TS text**: custom command inventory (`Cypress.Commands.add` / `addAll` / `overwrite`), alias hints (`.as` / `@alias`), intercept/route hints, and heuristic lite lint. No Cypress binary. No browser runtime. No network.

Distinct from **cypress-config-lab** (config heuristics).

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Cypress custom commands / support file** workflows — listing commands, aliases, and intercepts plus educational smell heuristics without launching Cypress.

## Tools

| Tool | Purpose |
|------|---------|
| `cy_commands_list` | source text → `{ commands, count }` |
| `cy_aliases_hint` | source text → `{ aliases, count }` |
| `cy_intercepts_hint` | source text → `{ intercepts, count }` |
| `cy_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports `cypress`, never opens files on disk or over the network, never evaluates test code, never launches a browser.
- Best-effort regex heuristics on `Cypress.Commands.add` / `overwrite` / `addAll` / `.as(` / `@alias` / `cy.intercept` / `cy.route` (not a full JS/TS AST or Cypress runtime).
- Lint rules are educational heuristics (empty, `cy.wait(number)` anti-pattern, `.then()` overuse, missing `data-cy`, `cy.route` deprecated, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/cypress-commands-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cypress-commands-lab`

## Skills

- **cy-commands-aliases** — custom command list + alias hints
- **cy-intercepts-lint** — intercept/route hints + lite lint

## License

MIT © Lawrence Hutchins
