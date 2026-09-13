---
name: fb-hosting
description: >
  Parse pasted firebase.json text locally with zero-auth MCP tools:
  list hosting sites (public, site, ignore, rewritesCount), Firestore
  rules/indexes paths, and functions source/runtime/codebase with
  predeploy hints. JSON-only — not Firebase CLI. No network, no firebase
  binary for tool logic.
version: 1.0.0
tags: [firebase, firebase-json, hosting, firestore, functions, parse, local]
---

# Firebase hosting / firestore / functions

Use these tools when the user pastes `firebase.json` text (never fetch a remote config, never run `firebase` for analysis):

1. **`fb_hosting_sites`** with `configText` — → `{sites: [{public?, site?, ignore?, rewritesCount?}]}` (hosting object or array).
2. **`fb_firestore_rules_hint`** with `configText` — → `{rules?, indexes?}` path strings only (does not read the files).
3. **`fb_functions_runtime`** with `configText` — → `{functions: [{source?, runtime?, codebase?}], predeployHints[]}`.

JSON-only scanner. Input cap ~1MB. Documented limitations apply (not Firebase CLI; no deploy/emulators).

## Example prompts

- "What hosting sites does this firebase.json declare?"
- "Where are the Firestore rules and indexes paths?"
- "What functions runtime and source are configured?"
