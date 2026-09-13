# Changelog

All notable changes to **gitleaks-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `gitleaks_rules_list` for `[[rules]]` id/description from pasted `.gitleaks.toml` → `[{id?, description?}]`.
- Add `gitleaks_allowlist_hint` for allowlist / paths / regexes / stopwords / allowlists → `[{method, count}]`.
- Add `gitleaks_config_hint` for title / extend / useDefault / entropy / keywords / tags / path → `[{method, count}]`.
- Add `gitleaks_lint_lite` for rule_without_id, allowlist_too_broad, empty_file, no_rules, and entropy_only.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs gitleaks CLI, never returns secret values. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
