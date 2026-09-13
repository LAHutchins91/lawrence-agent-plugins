# Makefile Lab

Zero-auth **local** MCP tools for **Makefile text**: list explicit rule targets, collect `.PHONY` names, look up simple variable assignments, and heuristic lite lint. No `make` binary. No network. No shell. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **Makefile text** workflows — target inventory, `.PHONY` extraction, variable lookup, and quick educational smell heuristics without invoking Make.

## Tools

| Tool | Purpose |
|------|---------|
| `make_targets_list` | Makefile text → `{ targets:[{name, deps?, line?}], count }` |
| `make_phony_list` | Makefile text → `{ phony, count }` |
| `make_var_lookup` | `{ text, name? }` → `{ vars:[{name, value?, flavor?}], count }` |
| `make_lint_lite` | Makefile text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `make`, never executes recipes, never opens files on disk or over the network.
- Explicit rule targets only (pattern rules like `%.o` are skipped). `.PHONY` declarations are not listed as targets unless the name also has a real rule.
- Variable parse is simple `VAR =` / `:=` / `?=` / `+=` (plus `::=` / `!=` flavors). No `$(eval)`, no `define`/`endef` bodies, no include follow.
- Lint rules are educational heuristics (tabs vs spaces, missing `.PHONY`, recursive make smells, undefined-looking `$(VAR)`, duplicates, empty file) — **not** an exploit guide.

## Start

```bash
node /workspace/makefile-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/makefile-lab`

## Skills

- **make-targets-vars** — list targets + look up variables
- **make-phony-lint** — `.PHONY` names + lite lint

## License

MIT © Lawrence Hutchins
