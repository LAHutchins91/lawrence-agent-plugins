---
name: fb-lint
description: >
  Lite-lint pasted firebase.json for missing hosting.public, emulators
  present (info), database rules path missing when the database key
  exists, and functions without runtime. Local only, no firebase CLI
  for tool logic, no fetch.
version: 1.0.0
tags: [firebase, firebase-json, lint, hosting, emulators, database, functions, local]
---

# Firebase JSON lint

Use **`fb_lint_lite`** with `configText` on pasted firebase.json (do not fetch URLs or run `firebase` for analysis):

- Missing `hosting.public` (warning; framework-aware `source` is not treated as `public`)
- `emulators` key present (info)
- `database` key exists but rules path is missing (warning)
- Functions entry without `runtime` (warning)

Heuristic only — not Firebase CLI / not schema validation. JSON-only scanner.

## Example prompts

- "Lint this firebase.json for missing hosting.public."
- "Does this firebase.json declare emulators?"
- "Is the Realtime Database rules path set? Any functions missing runtime?"
