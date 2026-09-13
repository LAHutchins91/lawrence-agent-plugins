# Rollup Config Lab

Zero-auth **local** MCP tools for **rollup config text**: list inputs, plugin constructor/factory names, output formats, and heuristic lite lint. No `rollup` binary. No network. No SaaS.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **rollup.config text** workflows — input inventory, plugin name lists, output format summaries, and quick educational smell heuristics without invoking Rollup.

## Tools

| Tool | Purpose |
|------|---------|
| `rollup_input_list` | rollup config text → `{ input, inputs, count }` |
| `rollup_plugins_list` | rollup config text → `{ plugins, count }` constructor / factory names |
| `rollup_output_formats` | rollup config text → `{ outputs, formats, count }` |
| `rollup_lint_lite` | rollup config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never runs `rollup` / `@rollup/cli`, never opens files on disk or over the network.
- Prefer **JSON/JSONC**. `rollup.config.js` / `.ts` / `.mjs` text uses **best-effort regex heuristics (no eval)** — spreads, computed keys, `require()` resolution, and function-returned dynamic configs are not fully resolved.
- Plugin names come from `new Foo(...)` / `foo()` / `require('...')` / quoted strings inside `plugins: [...]`.
- Lint rules are educational heuristics (empty config, missing input/output, UMD/IIFE without `name`, external tips, deprecated options, sourcemap tips, JS no-eval limits) — **not** an exploit guide.

## Start

```bash
node /workspace/rollup-config-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/rollup-config-lab`

## Skills

- **rollup-input-output** — inputs + output formats
- **rollup-plugins-lint** — plugins + lite lint

## License

MIT © Lawrence Hutchins
