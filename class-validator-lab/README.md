# Class Validator Lab

Zero-auth **local** MCP tools for **class-validator / class-transformer** TypeScript decorator text: DTO inventory, decorator hints, nested/`@Type` hints, and heuristic lite lint. No class-validator runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **class-validator DTO** workflows — listing DTOs/decorators/nested types and educational smell heuristics without importing class-validator or evaluating decorators.

## Tools

| Tool | Purpose |
|------|---------|
| `cv_dtos_list` | DTO text → `{ dtos, count }` |
| `cv_decorators_hint` | DTO text → `{ decorators, count }` |
| `cv_nested_hint` | DTO text → `{ nested, count }` |
| `cv_lint_lite` | DTO text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports class-validator / class-transformer, never opens files on disk or over the network, never evaluates decorator code.
- Best-effort regex heuristics on `@Is*` / `@ValidateNested` / `@Type` and class bodies (not a full TS AST).
- Lint rules are educational heuristics (empty, ValidateNested without Type, whitelist tip, IsOptional on required-looking fields, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/class-validator-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/class-validator-lab`

## Skills

- **cv-dtos-decorators** — DTO list + decorator hints
- **cv-nested-lint** — nested/`@Type` hints + lite lint

## License

MIT © Lawrence Hutchins
