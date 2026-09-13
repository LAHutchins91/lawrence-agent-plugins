---
name: gomod-require
description: "Parse pasted go.mod text locally with zero-auth MCP tools: extract module path + go version, list require / require() entries (including // indirect), and list replace directives. Lite line/block parser — not the go command. No network."
version: 1.0.0
tags: [go, gomod, golang, parse, local]
---

# Go.mod require

Use these tools when the user pastes go.mod text (never fetch a remote file, never run the go CLI):

1. **`gomod_module_path`** with `gomod` — → `{module, go?}`.
2. **`gomod_require_list`** with `gomod` — → `{requires: [{path, version, indirect?}]}`.
3. **`gomod_replace_list`** with `gomod` — → `{replaces: [{old, new, version?}]}`.

Lite line/block parser. Input cap ~1MB. Documented limitations apply (not golang.org/x/mod/modfile).

## Example prompts

- "What module path and Go version does this go.mod declare?"
- "List every require in this pasted go.mod, including indirect."
- "What replace directives are in this go.mod?"
