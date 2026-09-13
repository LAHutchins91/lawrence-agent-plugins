---
name: proto-lint
description: >
  Lite-lint pasted Protocol Buffer .proto text for missing syntax/package,
  duplicate field numbers in a message, reserved name issues, and empty
  services. Local only, no protoc, no fetch.
version: 1.0.0
tags: [protobuf, proto3, proto, lint, local]
---

# Proto lint

Use **`proto_lint_lite`** with `proto` on pasted `.proto` text (do not fetch URLs or run protoc):

- Missing `syntax = "..."` (warning) / `package` (warning)
- Duplicate field numbers in a message (error)
- Reserved name issues — protobuf keywords and `reserved "name"` clashes (error)
- Empty service with no RPCs (warning)

Heuristic only — not `protoc`, not a full protobuf compiler.

## Example prompts

- "Lint this .proto for duplicate field numbers and missing syntax."
- "Any reserved name issues in this proto?"
- "Does this pasted proto have an empty service?"
