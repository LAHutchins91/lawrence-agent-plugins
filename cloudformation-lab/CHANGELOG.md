# Changelog

All notable changes to **cloudformation-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `cfn_resources_list` for Resources → `[{id?, type?}]`.
- Add `cfn_parameters_hint` for Parameters → `[{name?, type?}]`.
- Add `cfn_outputs_hint` for Outputs / Export / Value / Description / Condition → `[{method, count}]`.
- Add `cfn_lint_lite` for missing_resources, wildcard_iam, noecho_missing_on_secret, empty_file, and hardcoded_account_ami.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs AWS CLI or cfn-lint binary. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
