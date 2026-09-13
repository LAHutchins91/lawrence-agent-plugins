# Changelog

All notable changes to **shellcheck-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `shellcheck_rules_list` for SC#### rule ids from pasted shell/config/comments (`SC2086`, `SC2155`, etc.) → `[{id?}]`.
- Add `shellcheck_disables_hint` for `disable=` / `enable=` / `# shellcheck disable` / `exclude=` → `[{method, count}]`.
- Add `shellcheck_config_hint` for `.shellcheckrc` / `--severity` / `--shell` / `--format` / `external-sources` / `source-path` → `[{method, count}]`.
- Add `shellcheck_lint_lite` for unquoted_variable, disable_without_reason, empty_file, broad_disable, and missing_shebang.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs shellcheck CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
