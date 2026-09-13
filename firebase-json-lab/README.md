# Firebase JSON Lab

Zero-auth **local** MCP tools for scanning pasted `firebase.json` text: hosting sites, Firestore rules/indexes paths, functions runtime, and lite lint. JSON-only (`JSON.parse`, with loose JSONC/trailing-comma strip when needed) — no Firebase CLI for tool logic, no deploy/emulators, no network.

This is **not** the Firebase CLI. Documented heuristics only.

## Tools

| Tool | Purpose |
|------|---------|
| `fb_hosting_sites` | hosting object or array → `{sites: [{public?, site?, ignore?, rewritesCount?}]}` |
| `fb_firestore_rules_hint` | firestore `rules` / `indexes` paths → `{rules?, indexes?}` |
| `fb_functions_runtime` | functions source/runtime/predeploy hints → `{functions: [{source?, runtime?, codebase?}]}` |
| `fb_lint_lite` | missing `hosting.public`, emulators present (info), database rules path missing when `database` key exists, functions without runtime → `{findings[]}` |

## Limits

- Pasted firebase.json text you already have. No sockets, DNS, remote fetches, or Firebase CLI for tool logic (`firebase` never run by tools).
- Input capped at ~1MB (`1048576` characters).
- **JSON-only**: prefers `JSON.parse`; strips `//` / `/* */` and trailing commas loosely when plain parse fails. Does not resolve file refs, start emulators, or deploy.
- Framework-aware hosting that uses `source` instead of `public` is noted; lite lint does not treat `source` as `public`.
- FREE MIT.

## Start

```bash
node /workspace/firebase-json-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/firebase-json-lab`

## Skills

- **fb-hosting** — list hosting sites and Firestore/functions hints from pasted firebase.json
- **fb-lint** — lite heuristic findings on pasted firebase.json

## License

MIT © Lawrence Hutchins — FREE
