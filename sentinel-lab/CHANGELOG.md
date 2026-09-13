# Changelog

All notable changes to **sentinel-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `sen_policies_list` for policy rule names / `main =` / policy identifiers → `[{name?}]`.
- Add `sen_imports_hint` for tfplan/v2 / tfconfig / tfrun / http / decimal / strings / types → `[{method, count}]`.
- Add `sen_params_hint` for param / default / filter / rule / when / as / else → `[{method, count}]`.
- Add `sen_lint_lite` for missing_main, import_without_use, empty_file, hard_fail_print, and param_without_default.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Sentinel CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
