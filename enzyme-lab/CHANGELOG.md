# Changelog

All notable changes to **enzyme-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `enz_mounts_list` for `mount(` / `shallow(` / `render(` heuristics → `[{kind, component?}]`.
- Add `enz_finders_hint` for `.find(` / `.findWhere(` / `.findAll(` / `.exists(` / `.contains(` / `.at(` / `.first(` / `.last(` usage counts → `[{method, count}]`.
- Add `enz_lifecycle_hint` for `.setProps(` / `.setState(` / `.setContext(` / `.unmount(` / `.update(` / `.dive(` / `.simulate(` usage counts → `[{method, count}]`.
- Add `enz_lint_lite` for mount without unmount, shallow without unmount (info), simulate without update, empty file, and deprecated_enzyme_patterns (info).
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Enzyme or React. Lite JS/TS scanner; ~1MB input cap. Document scanner limits. FREE MIT.
