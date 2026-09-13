# Changelog

All notable changes to **sops-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `sops_files_list` for sops-encrypted file markers / path hints from pasted YAML/JSON → `[{path?, format?}]`.
- Add `sops_keys_hint` for pgp / age / kms / gcp_kms / azure_kv / hc_vault → `[{method, count}]` (key types/refs only; long key material redacted).
- Add `sops_rules_hint` for creation_rules / path_regex / encrypted_regex / mac / lastmodified / version → `[{method, count}]`.
- Add `sops_lint_lite` for plaintext_secretish, missing_creation_rules, empty_file, age_and_pgp_mixed, and path_regex_too_broad.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs sops CLI, never decrypts, never returns secret values. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
