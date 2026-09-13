# Bicep Lab

Zero-auth **local** MCP tools for scanning pasted **Bicep** files: param listings (`name` + `type`), resource hints (Microsoft.* type counts), module hints (`module` / `existing` / `output` / `var` / `targetScope`), and lite lint. Lite scanner (same family as cloudformation-lab / serverless-lab) — **never runs Azure CLI or bicep CLI**, no network.

This is **not** an Azure CLI, Bicep compiler, or deployer. Documented heuristics only. Users may paste source that references Azure — this plugin does not depend on or execute those binaries.

## Tools

| Tool | Purpose |
|------|---------|
| `bicep_params_list` | params → `[{name?, type?}]` |
| `bicep_resources_hint` | resource Microsoft.* types → `[{method, count}]` |
| `bicep_modules_hint` | module / existing / output / var / targetScope → `[{method, count}]` |
| `bicep_lint_lite` | missing targetScope, param without type, http:// module, empty file, Password/Secret/Token without @secure() → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, Azure CLI execution, or bicep CLI for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full Bicep AST. Supported loosely: `//` / `/* */` comments stripped; simple `'/"/` string literals; common Bicep keywords. Not supported / incomplete: type system, symbolic evaluation, remote deploy / validate.
- Does not run Azure CLI or bicep CLI, and does not talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/bicep-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/bicep-lab`

## Skills

- **bicep-params** — list params and resource type counts from pasted Bicep
- **bicep-lint** — module/output/var/targetScope listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
