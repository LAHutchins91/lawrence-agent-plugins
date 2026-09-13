# Changelog

All notable changes to **swift-package-lab** are documented here.

## 1.0.0 — 2026-09-13

- Add `spm_products_list` for products `[.library/.executable/.plugin]` → `{name, type}`.
- Add `spm_targets_list` for targets `[.target/.testTarget/.executableTarget/.binaryTarget/.systemLibrary/.plugin]` → `{name, kind, dependencies?}`.
- Add `spm_deps_list` for `.package(url:/path: … from:/branch:/revision:/exact:)` → `{url?, path?, requirement?}`.
- Add `spm_lint_lite` for missing `name:`, missing `platforms`, duplicate target names, and branch-based deps note (not pinned).
- Add skills, smoke tests, and Cursor plugin packaging. Local only; no network, no swift/xcode. Lite Swift DSL scanner; ~1MB input cap. Document limits.
