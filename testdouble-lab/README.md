# Testdouble Lab

Zero-auth **local** MCP tools for **testdouble.js JS/TS text**: replacement inventory (`td.replace` / `td.replaceEsm`), `td.when` / `td.verify` hints, and heuristic lite lint. No `testdouble` runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **testdouble.js** workflows — listing replacements / when / verify and educational smell heuristics without importing `testdouble` or running tests.

## Tools

| Tool | Purpose |
|------|---------|
| `td_replacements_list` | source text → `{ replacements, count }` |
| `td_when_hint` | source text → `{ whens, count }` |
| `td_verify_hint` | source text → `{ verifies, count }` |
| `td_lint_lite` | source text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports testdouble, never opens files on disk or over the network, never evaluates doubles.
- Best-effort regex heuristics on `td.replace` / `td.replaceEsm` / `td.when(...).thenReturn|thenResolve|thenReject|thenCallback` / `td.verify` (not a full JS/TS AST or testdouble runtime).
- Lint rules are educational heuristics (empty, replace without reset tip, when without verify tip, function vs object double tips, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/testdouble-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/testdouble-lab`

## Skills

- **td-replacements-when** — replacement list + when hints
- **td-verify-lint** — verify hints + lite lint

## License

MIT © Lawrence Hutchins
