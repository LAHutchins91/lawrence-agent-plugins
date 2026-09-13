# Changelog

All notable changes to **yamllint-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `yamllint_rules_list` for known yamllint rule names from pasted .yamllint / YAML (`line-length`, `truthy`, `indentation`, `document-start`, `trailing-spaces`, `comments`, `braces`, `brackets`, `colons`, `commas`, `hyphens`, `key-duplicates`, `new-line-at-end-of-file`, `new-lines`, `octal-values`, `quoted-strings`) → `[{id?}]`.
- Add `yamllint_extends_hint` for `extends: default` / `relaxed` / `/path` → `[{method, count}]`.
- Add `yamllint_ignores_hint` for `ignore:` / `ignore-from-file:` / `yamllint disable` / `disable-line` / `disable-next-line` → `[{method, count}]`.
- Add `yamllint_lint_lite` for tabs_in_indent, missing_document_start, empty_file, rule_level_disable_all, and line_length_very_high.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs yamllint CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
