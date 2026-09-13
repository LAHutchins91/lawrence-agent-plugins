# Changelog

All notable changes to **opa-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `opa_packages_list` for package declarations → `[{name?}]`.
- Add `opa_rules_hint` for rule_heads / allow / deny / violation / default / import → `[{method, count}]`.
- Add `opa_tests_hint` for test_rules / with / mock_data → `[{method, count}]`.
- Add `opa_lint_lite` for missing_package, bare_deny_without_msg, empty_file, import_without_package, and test_without_package.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs OPA CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
