---
name: spm-lint
description: "Lite-lint pasted Package.swift for missing name:, missing platforms, duplicate target names, and branch-based (unpinned) dependencies. Local only, no swift/xcode, no fetch."
version: 1.0.0
tags: [swift, swiftpm, Package.swift, spm, lint, local]
---

# SPM lint

Use **`spm_lint_lite`** with `packageSwift` on pasted Package.swift (do not fetch URLs or run swift/xcodebuild):

- Missing `name: "…"` on `Package(…)` (warning)
- Missing `platforms: […]` (info)
- Duplicate target names (warning)
- Branch-based `.package(… branch:)` deps — not pinned (info)

Heuristic only — not `swift package` / not SwiftSyntax. Lite Swift DSL scanner.

## Example prompts

- "Lint this Package.swift for missing name and platforms."
- "Are there duplicate targets in this pasted Package.swift?"
- "Which dependencies are pinned to a branch instead of a version?"
