# GraphQL Codegen Lab

Zero-auth **local** MCP tools for **GraphQL Code Generator** config text (`codegen.yml` / `.json` / `.ts`): plugin / generates inventory, schema / documents hints, scalars map, and heuristic lite lint. No GraphQL Code Generator runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **graphql-codegen** workflows — listing `plugins` / `generates` targets, `schema` / `documents`, `config.scalars`, and educational smell heuristics without launching codegen.

## Tools

| Tool | Purpose |
|------|---------|
| `gqlc_plugins_list` | Config/CLI text → `{ plugins: string[], generates?: string[], count }` |
| `gqlc_documents_hint` | Config text → `{ schema?: string\|string[], documents?: string\|string[], count }` |
| `gqlc_scalars_hint` | Config text → `{ scalars: Record<string,string>, count }` |
| `gqlc_lint_lite` | Config text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to `@graphql-codegen/cli`, never opens files on disk or over the network, never runs codegen, never evaluates TypeScript/JavaScript.
- Prefer YAML/JSON parse via `yaml`; best-effort regex/object-literal heuristics for `codegen.ts` (no eval). Not a full TypeScript parser.
- Lint rules are educational heuristics (empty, missing schema tip, no documents tip, plaintext headers/auth tip, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/graphql-codegen-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/graphql-codegen-lab`

## Skills

- **gqlc-plugins-documents** — plugins/generates + schema/documents
- **gqlc-scalars-lint** — scalars map + lite lint

## License

MIT © Lawrence Hutchins
