---
name: ghz-targets
description: "List ghz host/call targets (ghz --insecure host:port, --call / -n package.Service/Method), plus proto hints (-proto / --protoset / --proto / -i / --import-paths / -d / --data / -D / --data-file / -m / --metadata) from pasted ghz shell/config source. Local only — never runs ghz or gRPC load tests, no fetch."
version: 1.0.0
tags: [ghz, grpc, load-testing, targets, local]
---

# ghz targets & proto

Use these tools when the user pastes ghz shell/config text (never fetch a remote file, never run ghz/load tests):

1. **`ghz_targets_list`** with `source` — → `{targets: [{host?, call?}], count}`.
2. **`ghz_proto_hint`** with `source` — → `{proto: [{method, count}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not ghz runtime; no load tests; no network).

## Example prompts

- "Which gRPC hosts/calls does this ghz script hit?"
- "What --proto / --data options are in this file?"
- "List ghz host:port and --call targets from this shell snippet."
