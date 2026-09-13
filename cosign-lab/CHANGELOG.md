# Changelog

All notable changes to **cosign-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `cosign_signs_list` for sign / sign-blob / dockerfile refs from pasted config/CI → `[{kind?, target?}]`.
- Add `cosign_verify_hint` for verify / verify_blob / certificate_identity / certificate_oidc_issuer / key → `[{method, count}]`.
- Add `cosign_attest_hint` for attest / attach / predicate / type / slsaprovenance / spdx / cyclonedx → `[{method, count}]`.
- Add `cosign_lint_lite` for sign_without_verify, insecure_allow_insecure, empty_file, keyless_without_issuer, and private_key_in_repo.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs cosign CLI. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
