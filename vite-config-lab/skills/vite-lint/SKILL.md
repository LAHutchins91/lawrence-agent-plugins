---
name: vite-lint
description: "Lite-lint pasted vite.config.* for missing root/base notes, server.host true (or 0.0.0.0) caution, empty plugins, and build.outDir missing when build is present. Local only, no vite binary, no fetch."
version: 1.0.0
tags: [vite, vite.config, lint, server, build, local]
---

# Vite lint

Use **`vite_lint_lite`** with `configText` on pasted vite config (do not fetch URLs or run vite):

- Missing `root` / `base` notes (info)
- `server.host: true` (or `0.0.0.0` / `::`) caution (warning)
- Empty `plugins: []` (warning)
- `build` present without `outDir` (warning)

Heuristic only — not Vite CLI / not a full AST. Lite JS/TS config scanner.

## Example prompts

- "Lint this vite.config.ts for empty plugins and missing outDir."
- "Is server.host true in this pasted Vite config?"
- "Does this config set root and base?"
