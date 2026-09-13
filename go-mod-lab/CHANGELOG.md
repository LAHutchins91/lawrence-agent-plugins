# Changelog

All notable changes to **go-mod-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `gomod_module_path` for go.mod text → `{module, go?}` from `module` / `go` directives.
- Add `gomod_require_list` for `require` / `require()` blocks → `{path, version, indirect?}`.
- Add `gomod_replace_list` for `replace` directives → `{old, new, version?}`.
- Add `gomod_lint_lite` for missing module, missing go directive, duplicate requires, replace without version notes, and retract presence info.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no go CLI. Lite line/block parser (not golang.org/x/mod/modfile); ~1MB input cap. Document limits.
