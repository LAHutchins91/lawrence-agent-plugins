---
name: spm-targets
description: >
  Parse pasted Package.swift text locally with zero-auth MCP tools: list
  products (.library/.executable/.plugin), targets (.target/.testTarget/…),
  and .package dependencies. Lite Swift DSL scanner — not swift package.
  No network, no swift/xcode.
version: 1.0.0
tags: [swift, swiftpm, Package.swift, spm, products, targets, dependencies, parse, local]
---

# SPM targets

Use these tools when the user pastes Package.swift text (never fetch a remote manifest, never run swift/xcodebuild):

1. **`spm_products_list`** with `packageSwift` — → `{products: [{name, type}]}` from `.library` / `.executable` / `.plugin`.
2. **`spm_targets_list`** with `packageSwift` — → `{targets: [{name, kind, dependencies?}]}`.
3. **`spm_deps_list`** with `packageSwift` — → `{dependencies: [{url?, path?, requirement?}]}` from `.package(...)`.

Lite Swift DSL scanner. Input cap ~1MB. Documented limitations apply (not `swift package`, no SwiftSyntax).

## Example prompts

- "Which products does this Package.swift declare?"
- "List every target and its dependencies in this pasted Package.swift."
- "What .package dependencies and version requirements are here?"
