---
name: buf-modules
description: >
  List buf module name/path (name: / path: / modules: entries) and deps
  hints (buf.build/... under deps:) from pasted buf.yaml / buf.work.yaml
  source. Local only — never runs buf CLI or fetches modules, no fetch.
version: 1.0.0
tags: [buf, protobuf, modules, deps, local]
---

# buf modules & deps

Use these tools when the user pastes buf.yaml / buf.work.yaml text (never fetch a remote file, never run buf):

1. **`buf_modules_list`** with `source` — → `{modules: [{name?, path?}], count}`.
2. **`buf_deps_hint`** with `source` — → `{deps: [{module?}], count}`.

Lite scanner. Input cap ~1MB. Documented limitations apply (not buf CLI; no module fetch; no network).

## Example prompts

- "Which buf modules does this workspace declare?"
- "What deps: does this buf.yaml list?"
- "List name:/path: from this buf.work.yaml."
