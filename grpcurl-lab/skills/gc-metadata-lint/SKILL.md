---
name: gc-metadata-lint
description: "Extract grpcurl -H / -rpc-header / -reflect-metadata flags (auth redacted) and run educational heuristic lite lint with the local zero-auth grpcurl-lab MCP. No grpcurl/gRPC runtime, no network."
version: 1.0.0
tags: [grpcurl, grpc, metadata, headers, lint, developer-tools]
---

# Grpcurl metadata & lite lint

When the user wants metadata inventory or a smell-check of pasted grpcurl text:

1. **`gc_metadata_hint`** — `{ text }` → `{ metadata: [{flag, value?}], count }` for `-H` / `-rpc-header` / `-reflect-metadata` (auth-looking values redacted).
2. **`gc_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty, plaintext/insecure tip, missing `-proto`/`-protoset`/`-use-reflection` tip,
     hardcoded bearer tip, etc. Not an exploit guide.

## Example prompts

- "What headers does this grpcurl command set?"
- "Lite-lint this grpcurl line for -plaintext and missing -proto"
- "Is there a hardcoded Bearer token in this grpcurl paste?"
