---
name: proto-list
description: >
  Parse pasted Protocol Buffer .proto text locally with zero-auth MCP tools:
  list messages (including nested names), list services/RPCs, look up fields.
  Lite regex scanner — not protoc. No network, no codegen.
version: 1.0.0
tags: [protobuf, proto3, proto, parse, local]
---

# Proto list

Use these tools when the user pastes `.proto` text (never fetch a remote file, never run protoc):

1. **`proto_list_messages`** with `proto` — → `{messages: [{name, fieldsCount?}]}`. Nested names as `Parent.Child` when easy.
2. **`proto_list_services`** with `proto` — services and `{name, request, response, streaming?}` RPCs.
3. **`proto_field_lookup`** with `proto` + `messageName` — fields `{name, number, type, label?}`.

Lite scanner: `//` / `/* */` comments and strings stripped loosely; common proto3 only. Input cap ~1MB.

## Example prompts

- "List every message in this .proto, including nested ones."
- "What RPCs does UserService expose, and which stream?"
- "Look up fields on message User in this proto text."
