# Swift Package Lab

Zero-auth **local** MCP tools for scanning pasted `Package.swift` text: products, targets, dependencies, and lite lint. Lite Swift PackageDescription DSL scanner only — no `swift` / Xcode, no resolve/build, no network.

This is **not** `swift package` and **not** SwiftSyntax: common `Package(name:, platforms:, products:, dependencies:, targets:)` shapes with `.library` / `.executable` / `.plugin`, `.package(url:/path: …)`, and `.target` / `.testTarget` / `.executableTarget` / `.binaryTarget` / `.systemLibrary` are supported. Macros, `#if` evaluation, and full expression AST are out of scope.

## Tools

| Tool | Purpose |
|------|---------|
| `spm_products_list` | → `{products: [{name, type}]}` from `.library` / `.executable` / `.plugin` |
| `spm_targets_list` | → `{targets: [{name, kind, dependencies?}]}` from `.target` / `.testTarget` / … |
| `spm_deps_list` | → `{dependencies: [{url?, path?, requirement?}]}` from `.package(...)` |
| `spm_lint_lite` | missing `name:`, missing `platforms`, duplicate targets, branch-based deps → `{findings[]}` |

## Limits

- Pasted `Package.swift` text you already have. No sockets, DNS, remote fetches, or Swift/Xcode CLI (`swift`, `swiftc`, `xcodebuild`).
- Input capped at ~1MB (`1048576` characters).
- **Lite Swift DSL scanner**: `//` and `/* */` comments stripped loosely; simple `"…"` strings; labeled `name:` / `url:` / `from:` / `branch:` etc. Not a full language parser — no AST, no macros, no `#if` branches evaluated.
- Does not read `Package.resolved`. Unusual formatting may be missed. Documented heuristics only — not `swift package dump-package`.
- FREE MIT.

## Start

```bash
node /workspace/swift-package-lab/dist/bundle.js
```

Local plugin install: `~/.cursor/plugins/local/swift-package-lab`

## Skills

- **spm-targets** — list products, targets, and dependencies from pasted Package.swift
- **spm-lint** — lite heuristic findings on pasted Package.swift

## License

MIT © Lawrence Hutchins — FREE
