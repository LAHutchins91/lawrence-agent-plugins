# Changelog

All notable changes to **cargo-toml-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `cargo_deps_list` for Cargo.toml text → `{name, kind, versionReq?}` from `[dependencies]` / `[dev-dependencies]` / `[build-dependencies]`.
- Add `cargo_features_list` for `[features]` → `{name, enables[]}`.
- Add `cargo_bin_targets` for `[[bin]]` plus default package-name bin.
- Add `cargo_lint_lite` for missing package name/version, wildcard deps, path-dep notes, duplicate feature names, and missing edition hint.
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no cargo CLI. Lite TOML subset parser (not full TOML 1.0); ~1MB input cap. Document limits.
