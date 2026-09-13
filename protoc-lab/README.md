# Protoc Lab

Zero-auth **local** MCP tools for **protoc** CLI text: include/proto inventory, `--*_out` / `--plugin` hints, other common options, and heuristic lite lint. No protoc binary. No protobuf compiler runtime. No network.

## Why novel

No zero-auth local MCP in the catalog focuses on practical **protoc** workflows — listing `-I` / `--proto_path` and trailing `.proto` files, generator plugins (`--cpp_out`, `--python_out`, `--go_out`, `--js_out`, `--grpc_out`, `--plugin=`), descriptor/optional flags, and educational smell heuristics without launching protoc.

## Tools

| Tool | Purpose |
|------|---------|
| `pc_includes_list` | CLI text → `{ includes: string[], protos: string[], count }` |
| `pc_plugins_hint` | CLI text → `{ plugins: [{name, out?}], count }` |
| `pc_options_hint` | CLI text → `{ options: [{flag, value?}], count }` |
| `pc_lint_lite` | CLI text → `{ findings, findingCount }` |

## Caps & caveats

- **String analysis only** — never imports or shells out to protoc, never opens files on disk or over the network, never runs the protobuf compiler, never evaluates code.
- Best-effort regex heuristics on common protoc shapes (`protoc -I. --python_out=gen api/foo.proto`). Not a full shell parser.
- Lint rules are educational heuristics (empty, missing `-I` tip, no `*_out` tip, absolute path tips, etc.) — **not** an exploit guide.

## Start

```bash
node /workspace/protoc-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/protoc-lab`

## Skills

- **pc-includes-plugins** — includes/protos + generator plugins
- **pc-options-lint** — options hints + lite lint

## License

MIT © Lawrence Hutchins
