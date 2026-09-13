# Changelog

All notable changes to **io-ts-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `iots_codecs_list` for `t.type` / `t.interface` / `t.partial` / `t.array` / `t.union` / `t.intersection` / `t.strict` export/const names → `[{name?, kind}]`.
- Add `iots_props_hint` for keys inside `t.type({ ... })` / `t.interface` → `[{field, typeHint?}]`.
- Add `iots_brand_hint` for `t.brand` / `Brand` usage counts → `[{method, count}]`.
- Add `iots_lint_lite` for type vs strict confusion note, missing `t.exact`, empty codec, and no Decoder export hint.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no io-ts `decode()`/`encode()`. Lite TypeScript scanner; ~1MB input cap. Document scanner limits. FREE MIT.
