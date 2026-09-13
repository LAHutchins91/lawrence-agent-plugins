---
name: cargo-lint
description: "Lite-lint pasted Cargo.toml for missing package name/version, wildcard dependencies (*), path-dep notes, duplicate feature names, and missing edition hint. Local only, no cargo CLI, no fetch."
version: 1.0.0
tags: [cargo, toml, rust, lint, local]
---

# Cargo lint

Use **`cargo_lint_lite`** with `toml` on pasted Cargo.toml (do not fetch URLs or run cargo):

- Missing `[package]` name / version (error)
- Wildcard dependency versions `*` (warning)
- Path dependencies (info note)
- Duplicate feature names in `[features]` (error)
- Missing `edition` hint (info)

Heuristic only — not `cargo check` / clippy. Lite TOML subset parser.

## Example prompts

- "Lint this Cargo.toml for wildcards and missing package fields."
- "Any path deps or missing edition in this pasted Cargo.toml?"
- "Flag duplicate features in this Cargo.toml."
