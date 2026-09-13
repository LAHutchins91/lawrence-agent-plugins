# OpenAPI Generator Lab

Zero-auth **local** MCP tools for scanning pasted **openapi-generator** CLI/config: generator listings (`-g` / `--generator-name` / `generatorName:`), config flag counts (`-i` / `--input-spec` / `-o` / `--output` / `-c` / `--config` / `--additional-properties` / `--global-property` / `--skip-validate-spec` / `--enable-post-process-file`), template/package hints (`-t` / `--template-dir` / `templateDir` / `supportingFiles` / `apiPackage` / `modelPackage` / `invokerPackage` / `packageName`), and lite lint. Lite scanner (same family as buf-lab / ghz-lab) — **never runs openapi-generator or Java codegen, never fetches OpenAPI specs**, no network.

This is **not** the openapi-generator CLI or a codegen runtime. Documented heuristics only. Users may paste source that references `openapi-generator` — this plugin does not depend on or execute that binary.

## Tools

| Tool | Purpose |
|------|---------|
| `og_generators_list` | `-g` / `--generator-name` / `generatorName:` → `[{name?}]` |
| `og_config_hint` | `-i` / `--input-spec` / `-o` / `--output` / `-c` / `--config` / `--additional-properties` / `--global-property` / `--skip-validate-spec` / `--enable-post-process-file` → `[{method, count}]` |
| `og_templates_hint` | `-t` / `--template-dir` / `templateDir` / `supportingFiles` / `apiPackage` / `modelPackage` / `invokerPackage` / `packageName` → `[{method, count}]` |
| `og_lint_lite` | generate without `-g`, without `-i`/`--input-spec`, `--skip-validate-spec`, empty file, `-o .` / `output: .` → `{findings[]}` |

## Limits

- Pasted source text you already have. No sockets, DNS, remote fetches, openapi-generator execution, or Java codegen for tool logic.
- Input capped at ~1MB (`1048576` characters).
- **Lite only** — not a full shell/YAML AST. Supported loosely: `//`, `/* */`, and `#` comments stripped; simple `'/"/\`` string literals; common openapi-generator flags and config keys. Not supported / incomplete: spreads, imported helpers, computed keys, remote spec fetch.
- Does not run openapi-generator or talk to a network.
- FREE MIT.

## Start

```bash
node /workspace/openapi-generator-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/openapi-generator-lab`

## Skills

- **og-generators** — list generator names and config flag hints from pasted openapi-generator source
- **og-lint** — template/package listings + lite heuristic findings

## License

MIT © Lawrence Hutchins — FREE
