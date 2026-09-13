---
name: netlify-redirects
description: "Parse pasted netlify.toml text locally with zero-auth MCP tools: list [[redirects]] (from, to, status, force), [[headers]] for/headerKeys, and [build] command/publish/functions/environmentKeys. Lite TOML — not Netlify CLI. No network, no netlify binary for tool logic."
version: 1.0.0
tags: [netlify, netlify-toml, redirects, headers, build, parse, local]
---

# Netlify redirects / headers / build

Use these tools when the user pastes `netlify.toml` text (never fetch a remote config, never run `netlify` for analysis):

1. **`netlify_redirects_list`** with `toml` — → `{redirects: [{from, to, status?, force?}]}`.
2. **`netlify_headers_hint`** with `toml` — → `{headers: [{for, headerKeys[]}]}` (keys under `values` only).
3. **`netlify_build_command`** with `toml` — → `{command?, publish?, functions?, environmentKeys?}`.

Lite TOML scanner. Input cap ~1MB. Documented limitations apply (not Netlify CLI; no deploy).

## Example prompts

- "What redirects does this netlify.toml declare?"
- "Which header keys are set for /*?"
- "What is the Netlify build command and publish directory?"
