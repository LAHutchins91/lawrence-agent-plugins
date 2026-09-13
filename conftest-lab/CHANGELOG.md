# Changelog

All notable changes to **conftest-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ct_policies_list` for package / deny / violation policy identifiers → `[{name?, kind?}]`.
- Add `ct_namespaces_hint` for package_main / package_namespaces / package_namespaces_sub → `[{method, count}]`.
- Add `ct_inputs_hint` for input_dot / input_bracket / with_input_as / conf_test → `[{method, count}]`.
- Add `ct_lint_lite` for missing_package, deny_without_msg, empty_file, non_main_without_namespace_flag, and violation_and_deny_mixed.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs conftest/OPA CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
