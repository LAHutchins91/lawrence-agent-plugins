# Kubb Lab

Zero-auth **local** MCP tools for **Kubb** OpenAPI codegen config text (`kubb.config.ts` / `.js` / `.json`): output path inventory, plugin detection, hooks hints, and heuristic lite lint. No `@kubb/cli` or codegen runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **kubb.config** workflows — listing `output.path` / per-plugin outputs, detecting `pluginOas` / `pluginTs` / `pluginReactQuery` / `@kubb/swagger-*`, extracting `hooks.done`, and educational smell heuristics without launching Kubb.

## Tools

| Tool | Purpose |
|------|---------|
| `kb_outputs_list` | Config text → `{ outputs: [{path?, plugin?}], count }` |
| `kb_plugins_hint` | Config text → `{ plugins: string[], count }` |
| `kb_hooks_hint` | Config text → `{ hooks: [{name?, command?}], count }` |
| `kb_lint_lite` | Config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to `@kubb/cli`, never opens files on disk or over the network, never runs codegen, never evaluates TypeScript/JavaScript.
- Prefer JSON/YAML parse via `yaml`; best-effort regex/object-literal heuristics for `kubb.config.ts` (no eval). Not a full TypeScript parser.
- Lint rules are educational heuristics (empty, missing input.path / output.path tips, remote OpenAPI URL tip, hardcoded apiKey/Authorization tip, absolute output path tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/kubb-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/kubb-lab`

## Skills

- **kb-outputs-plugins** — outputs + plugins inventory
- **kb-hooks-lint** — hooks extraction + lite lint

## License

MIT © Lawrence Hutchins
