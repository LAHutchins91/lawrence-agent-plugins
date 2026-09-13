---
name: pc-options-lint
description: "Extract other common protoc flags (--descriptor_set_out, --include_imports, --experimental_allow_proto3_optional, etc.) and run educational heuristic lite lint with the local zero-auth protoc-lab MCP. No protoc/protobuf compiler runtime, no network."
version: 1.0.0
tags: [protoc, protobuf, options, lint, cli, developer-tools]
---

# Protoc options & lite lint

When the user wants option inventory or a smell-check of pasted protoc text:

1. **`pc_options_hint`** — `{ text }` → `{ options: [{flag, value?}], count }` for non-include / non-`*_out` flags.
2. **`pc_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, missing `-I` tip, no `*_out` tip, absolute path tips, etc. Not an exploit guide.

## Example prompts

- "What descriptor / optional flags does this protoc command set?"
- "Lite-lint this protoc line for missing -I and no *_out"
- "Are there absolute paths in this protoc paste?"
