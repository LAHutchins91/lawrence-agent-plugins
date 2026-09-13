# Changelog

All notable changes to **firebase-json-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `fb_hosting_sites` for hosting object or array → `{public?, site?, ignore?, rewritesCount?}`.
- Add `fb_firestore_rules_hint` for firestore `rules` / `indexes` paths.
- Add `fb_functions_runtime` for functions `source` / `runtime` / `codebase` (predeploy hints in notes).
- Add `fb_lint_lite` for missing `hosting.public`, emulators present (info), database rules path missing when `database` exists, and functions without runtime.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no firebase CLI. JSON-only firebase.json scanner (loose JSONC); ~1MB input cap. Document limits. FREE MIT.
