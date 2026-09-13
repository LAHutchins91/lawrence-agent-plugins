# Changelog

All notable changes to **age-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `age_recipients_list` for age1 public recipients / -r flags from pasted config/scripts → `[{prefix?}]` (truncated to ~12 chars + …).
- Add `age_identities_hint` for identity_flag / identity_file / secret_key_marker (AGE-SECRET-KEY- count only, redacted) / ssh_recipient → `[{method, count}]`.
- Add `age_rules_hint` for armor / armor_flag / recipients_file / encrypt / decrypt / passphrase → `[{method, count}]`.
- Add `age_lint_lite` for private_key_in_paste, encrypt_without_recipient, empty_file, passphrase_flag, and decrypt_in_ci.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, never runs age CLI, never decrypts, never returns private keys or secret values. Lite scanner; ~1MB input cap. Document scanner limits. FREE MIT.
