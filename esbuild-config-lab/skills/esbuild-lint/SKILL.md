---
name: esbuild-lint
description: >
  Lite-lint pasted esbuild build options for missing outfile/outdir, bundle false
  with multiple entryPoints, format missing when platform is browser, and minify
  without sourcemap note. Local only, no esbuild binary for tool logic, no fetch.
version: 1.0.0
tags: [esbuild, lint, outfile, outdir, bundle, format, minify, local]
---

# Esbuild lint

Use **`esbuild_lint_lite`** with `configText` on pasted esbuild config (do not fetch URLs or run esbuild for analysis):

- Missing `outfile` / `outdir` (warning)
- `bundle: false` with multiple `entryPoints` (warning)
- `platform: 'browser'` without explicit `format` (warning)
- `minify: true` without a truthy `sourcemap` (info)

Heuristic only — not esbuild CLI / not a full AST. Lite JS/TS config scanner.

## Example prompts

- "Lint this esbuild config for missing outfile/outdir."
- "Is bundle false with multiple entries in this pasted build options?"
- "Does this browser platform config set format and sourcemap?"
