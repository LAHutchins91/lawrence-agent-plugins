---
name: pc-includes-plugins
description: "Extract protoc -I / --proto_path includes, trailing .proto files, and --*_out / --plugin= generators with the local zero-auth protoc-lab MCP. No protoc/protobuf compiler runtime, no network."
version: 1.0.0
tags: [protoc, protobuf, includes, plugins, cli, developer-tools]
---

# Protoc includes & plugins

When the user pastes **protoc** CLI text and needs include / generator inventory:

1. **`pc_includes_list`** — `{ text }` → `{ includes: string[], protos: string[], count }` from `-I` / `--proto_path` and trailing `.proto` files.
2. **`pc_plugins_hint`** — `{ text }` → `{ plugins: [{name, out?}], count }` for `--cpp_out` / `--python_out` / `--go_out` / `--js_out` / `--grpc_out` / `--plugin=`.

## Example prompts

- "Which include paths and .proto files does this protoc line use?"
- "What generators (--*_out) are configured here?"
- "Parse --plugin= and --go_out from this protoc paste"
