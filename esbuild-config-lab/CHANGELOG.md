# Changelog

All notable changes to **esbuild-config-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `esbuild_entry_points` for `entryPoints` string / array / object → `{name?, path}`.
- Add `esbuild_loaders_map` for `loader: { '.png': 'file', … }` → `{ext, loader}`.
- Add `esbuild_external_list` for `external: […]` → string list.
- Add `esbuild_lint_lite` for missing outfile/outdir, `bundle: false` with multiple entries, `format` missing when `platform: 'browser'`, and minify without sourcemap note.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no esbuild binary for tool logic. Lite JS/TS config scanner (`build({…})` or exported options); ~1MB input cap. Document limits. FREE MIT.
