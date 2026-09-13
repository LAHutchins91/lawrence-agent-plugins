# Cargo TOML Lab

Zero-auth **local** MCP tools for scanning pasted `Cargo.toml` text: list dependencies, features, bin targets, and lite lint. Lite TOML subset parser only — no `cargo` binary, no network.

This is **not a full TOML 1.0 / cargo parser**: common tables, inline tables, arrays, and `[[bin]]` are supported. Workspace inheritance, full target graphs, and registry resolution are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `cargo_deps_list` | TOML text → `{dependencies: [{name, kind, versionReq?}]}` from dep tables |
| `cargo_features_list` | → `{features: [{name, enables[]}]}` from `[features]` |
| `cargo_bin_targets` | → `{bins: [{name, path?}]}` from `[[bin]]` + default package-name bin |
| `cargo_lint_lite` | missing package name/version, wildcard `*`, path deps, duplicate features, missing edition → `{findings[]}` |

## Limits

- Pasted `Cargo.toml` text you already have. No sockets, DNS, remote fetches, or `cargo` CLI.
- Input capped at ~1MB (`1048576` characters).
- **Lite TOML subset** (from ini-toml-lite approach): bare/quoted/dotted keys; basic/literal strings (incl. multiline); ints/floats; bools; arrays; inline tables; `[tables]`; `[[arrays of tables]]`; `#` comments. Not full TOML 1.0 (no hex/oct/bin ints, ±inf/nan, native date-times, strict array homogeneity, etc.).
- Default bin assumes conventional `src/main.rs` when package name is set; filesystem is not checked. `src/bin/*` auto-discovery is not inferred from TOML alone.
- `[workspace.dependencies]` inheritance is not expanded.

## Start

```bash
node /workspace/cargo-toml-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/cargo-toml-lab`

## Skills

- **cargo-deps** — list dependencies / features / bin targets from pasted Cargo.toml
- **cargo-lint** — lite heuristic findings on pasted Cargo.toml

## License

MIT © Lawrence Hutchins — FREE
