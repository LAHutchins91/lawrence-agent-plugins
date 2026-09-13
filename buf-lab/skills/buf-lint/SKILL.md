---
name: buf-lint
description: "List buf lint/breaking config keys (use: / except: / ignore: / enum_zero_value_suffix / rpc_allow_same_request_response / SERVICE_SUFFIX) and lite-lint for missing name:, deps without buf.lock, many except:, empty file, and buf.gen.yaml without plugins:. Local only, never runs buf CLI, no fetch."
version: 1.0.0
tags: [buf, protobuf, lint, local]
---

# buf lint config & lite lint

Use these tools on pasted buf.yaml / buf.gen.yaml source (do not fetch URLs or run buf):

1. **`buf_lint_cfg_hint`** with `source` — → `{lintCfg: [{method, count}], count}`.
2. **`buf_lint_lite`** with `source` — findings:
   - buf.yaml without name: (warning)
   - deps: without buf.lock mention (info)
   - many except: rules (warning)
   - Empty file (warning)
   - buf.gen.yaml without plugins: (warning)

Disclaimer only — not the buf CLI. Lite scanner.

## Example prompts

- "Any missing module name:?"
- "Is except: heavy in this buf.yaml?"
- "Lint this buf.gen.yaml for missing plugins."
