# Grpcurl Lab

Zero-auth **local** MCP tools for **grpcurl** CLI text: service/target inventory, fully-qualified method hints, metadata/header extraction (auth redacted), and heuristic lite lint. No grpcurl binary. No gRPC runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **grpcurl** workflows — listing host:port targets and services, `package.Service/Method` calls, `-H` / `-rpc-header` / `-reflect-metadata` (with auth redaction), and educational smell heuristics without launching grpcurl.

## Tools

| Tool | Purpose |
|------|---------|
| `gc_services_list` | CLI text → `{ targets: [{host?}], services: string[], count }` |
| `gc_methods_hint` | CLI text → `{ methods: [{service?, method?}], count }` |
| `gc_metadata_hint` | CLI text → `{ metadata: [{flag, value?}], count }` (auth redacted) |
| `gc_lint_lite` | CLI text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to grpcurl, never opens files on disk or over the network, never dials gRPC, never evaluates code.
- Best-effort regex heuristics on common grpcurl shapes (`grpcurl -plaintext localhost:50051 list`, `package.Service/Method`). Not a full shell parser.
- Lint rules are educational heuristics (empty, plaintext/insecure tip, missing `-proto`/`-protoset`/`-use-reflection` tip, hardcoded bearer tip, etc.) — **not** an exploit guide.
- Metadata values that look like Authorization / Bearer / API keys are redacted to `***`.

## Start

```bash
node /workspace/grpcurl-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/grpcurl-lab`

## Skills

- **gc-services-methods** — targets/services + fully-qualified methods
- **gc-metadata-lint** — metadata hints + lite lint

## License

MIT © Lawrence Hutchins
