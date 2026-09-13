# Changelog

All notable changes to **crossplane-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `xp_composites_list` for Composition / CompositeResourceDefinition → `[{kind?, name?}]`.
- Add `xp_providers_hint` for Provider / ProviderConfig / ControllerConfig / DeploymentRuntimeConfig / package: / pkg.crossplane.io → `[{method, count}]`.
- Add `xp_claims_hint` for claimNames / compositeRef / resourceRef / connectionSecretRef / writeConnectionSecretToRef / compositionRef / compositionSelector → `[{method, count}]`.
- Add `xp_lint_lite` for missing_composition_ref, xrd_without_claim_names, provider_without_config, empty_file, and insecure_http_package.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs crossplane or kubectl, never fetches remote packages. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
