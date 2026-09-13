# Protobuf Lite Lab

Zero-auth **local** MCP tools for scanning pasted Protocol Buffer `.proto` text: list messages, list services/RPCs, look up fields, and lite lint. String / regex scanner only — no `protoc`, no codegen, no network.

This is **not a full protobuf compiler**: `//` and `/* */` comments and `"strings"` are stripped loosely; common proto3 `message` (including nested), `service` / `rpc` / `stream`, field labels, `map<k,v>`, and `oneof` fields are supported. No import resolution, no proto2 groups, no options AST, no official parser.

## Tools

| Tool | Purpose |
|------|---------|
| `proto_list_messages` | `.proto` text → `{messages: [{name, fieldsCount?}]}` (nested names when easy) |
| `proto_list_services` | → `{services: [{name, rpcs:[{name, request, response, streaming?}]}]}` |
| `proto_field_lookup` | proto + messageName → `{fields: [{name, number, type, label?}]}` |
| `proto_lint_lite` | missing syntax/package, duplicate field numbers, reserved name issues, empty service → `{findings[]}` |

## Limits

- Pasted `.proto` text you already have. No sockets, DNS, remote fetches, `protoc`, or codegen.
- Input capped at ~1MB (`1048576` characters).
- **Not** a full protobuf parser: no import graph, no `extend` / proto2 group fidelity, no custom-option AST, no descriptor/codegen output.
- Nested messages listed as `Parent.Child` when brace-matched; exotic option blocks may confuse the scanner.
- Reserved-name checks cover protobuf keywords and `reserved "name"` lists. Field-number ranges `19000–19999` are noted when used.
- Common proto3 only. Lite regex/scanner.

## Start

```bash
node /workspace/protobuf-lite-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/protobuf-lite-lab`

## Skills

- **proto-list** — list messages / services / look up fields from pasted `.proto`
- **proto-lint** — lite heuristic findings on pasted `.proto`

## License

MIT © Lawrence Hutchins — FREE
