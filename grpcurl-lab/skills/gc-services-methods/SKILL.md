---
name: gc-services-methods
description: "Extract grpcurl targets/services and fully-qualified methods (package.Service/Method) with the local zero-auth grpcurl-lab MCP. No grpcurl/gRPC runtime, no network."
version: 1.0.0
tags: [grpcurl, grpc, services, methods, cli, developer-tools]
---

# Grpcurl services & methods

When the user pastes **grpcurl** CLI text and needs service / method inventory:

1. **`gc_services_list`** — `{ text }` → `{ targets: [{host?}], services: string[], count }` from invocations / `list` / service names.
2. **`gc_methods_hint`** — `{ text }` → `{ methods: [{service?, method?}], count }` for fully-qualified calls.

## Example prompts

- "Which host and services does this grpcurl list target?"
- "What methods are called in this grpcurl paste?"
- "Parse package.Service/Method from these grpcurl lines"
