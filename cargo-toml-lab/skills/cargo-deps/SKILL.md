---
name: cargo-deps
description: >
  Parse pasted Cargo.toml text locally with zero-auth MCP tools:
  list dependencies (deps/dev/build), features with enables, and bin targets.
  Lite TOML subset — not cargo CLI. No network.
version: 1.0.0
tags: [cargo, toml, rust, parse, local]
---

# Cargo deps

Use these tools when the user pastes Cargo.toml text (never fetch a remote file, never run cargo):

1. **`cargo_deps_list`** with `toml` — → `{dependencies: [{name, kind, versionReq?}]}`.
2. **`cargo_features_list`** with `toml` — → `{features: [{name, enables[]}]}`.
3. **`cargo_bin_targets`** with `toml` — → `{bins: [{name, path?}]}` including default package-name bin.

Lite TOML subset parser. Input cap ~1MB. Documented limitations apply (not full TOML 1.0).

## Example prompts

- "List every dependency in this Cargo.toml."
- "What features does this crate expose?"
- "What bin targets are declared in this pasted Cargo.toml?"
