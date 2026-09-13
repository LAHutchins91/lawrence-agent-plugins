# Swagger Codegen Lab

Zero-auth **local** MCP tools for **swagger-codegen** / **openapi-generator** CLI text: language/generator inventory, config / additionalProperties hints, template-dir / library hints, and heuristic lite lint. No codegen binary. No OpenAPI generator runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **swagger-codegen / openapi-generator** workflows — listing `-l` / `--lang` / `-g` / `--generator-name`, `-c` / `--config` and `-p` / `--additional-properties`, `-t` / `--template-dir` / `--library`, and educational smell heuristics without launching a generator.

## Tools

| Tool | Purpose |
|------|---------|
| `sc_languages_list` | CLI text → `{ languages: string[], generators?: string[], count }` |
| `sc_config_hint` | CLI text → `{ configs: [{path?, keys?}], additionalProperties?, count }` |
| `sc_templates_hint` | CLI text → `{ templates: [{path?}], library?, count }` |
| `sc_lint_lite` | CLI text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to swagger-codegen / openapi-generator, never opens files on disk or over the network, never runs codegen, never evaluates code.
- Best-effort regex heuristics on common CLI shapes (`openapi-generator-cli generate -g java -i openapi.yaml -o out`). Optional light JSON/YAML parse when a config document is pasted inline. Not a full shell parser.
- Lint rules are educational heuristics (empty, missing `-i`/`-g` tip, swagger-codegen vs openapi-generator tip, hardcoded apiKey tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/swagger-codegen-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/swagger-codegen-lab`

## Skills

- **sc-languages-config** — languages/generators + config/additionalProperties
- **sc-templates-lint** — templates/library + lite lint

## License

MIT © Lawrence Hutchins
