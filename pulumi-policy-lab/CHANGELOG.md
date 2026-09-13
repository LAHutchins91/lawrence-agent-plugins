# Changelog

All notable changes to **pulumi-policy-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `ppol_policies_list` for PolicyPack / policies array names → `[{name?, kind?}]`.
- Add `ppol_rules_hint` for validateResource / validateStack / ResourceValidationPolicy / StackValidationPolicy / enforcementLevel / advisory / mandatory → `[{method, count}]`.
- Add `ppol_packs_hint` for PolicyPack / policyPackArgs / policies: / name: / enforcementLevel: / displayName → `[{method, count}]`.
- Add `ppol_lint_lite` for missing_policy_pack, no_enforcement_level, empty_policies, empty_file, and mandatory_without_message.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs Pulumi CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
