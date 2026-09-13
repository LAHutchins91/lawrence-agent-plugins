# Wrk Lab

Zero-auth **local** MCP tools for **wrk / wrk2** Lua script + CLI text: Lua hook inventory, `wrk.*` API hints, CLI option hints, and heuristic lite lint. No wrk runtime. No load-test executor. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **wrk / wrk2** workflows — listing Lua `setup` / `init` / `request` / `response` / `done` hooks, `wrk.method` / `wrk.headers` / `wrk.body` / `wrk.format` uses, CLI `-c` / `-d` / `-t` / `-R` / `-s` options, and educational smell heuristics without launching wrk.

## Tools

| Tool | Purpose |
|------|---------|
| `wrk_scripts_list` | Lua / CLI text → `{ hooks: [{name}], count }` |
| `wrk_lua_hint` | Lua text → `{ wrkUses: [{api}], count }` |
| `wrk_options_hint` | Shell/CLI text → `{ options: [{flag, value?}], count }` |
| `wrk_lint_lite` | Lua / CLI text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to wrk/wrk2, never opens files on disk or over the network, never runs a load test, never evaluates Lua (no Lua VM).
- Best-effort regex heuristics on common wrk shapes (`function request()`, `wrk.method`, `wrk -c … -d … -t …`). Not a full Lua AST or shell parser.
- Lint rules are educational heuristics (empty, missing `-c`/`-t` tip, unbounded duration tip, no script tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/wrk-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/wrk-lab`

## Skills

- **wrk-scripts-lua** — Lua hooks list + `wrk.*` API hints
- **wrk-options-lint** — CLI options hints + lite lint

## License

MIT © Lawrence Hutchins
