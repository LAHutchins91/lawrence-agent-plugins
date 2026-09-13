# Changelog

All notable changes to **chai-assert-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `chai_asserts_list` for `expect(` / `assert.` / `should` heuristics → `[{style, count}]`.
- Add `chai_chains_hint` for `.to.equal` / `.deep.equal` / `.include` / `.throw` / `.eventually` → `[{chain, count}]`.
- Add `chai_plugins_hint` for `chai.use(` / `chai-as-promised` / `sinon-chai` usage counts → `[{plugin, count}]`.
- Add `chai_lint_lite` for mixed expect+assert styles, `==` comparisons near expect, empty file, and missing chai import.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never executes assertions. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
