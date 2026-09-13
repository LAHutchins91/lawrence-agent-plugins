---
name: semver-debug
description: "Debug npm-style semver ranges — satisfies checks, range intersection, and minimum satisfying version from candidates (local zero-auth MCP)."
version: 1.0.0
tags: [semver, ranges, npm, debug, versions]
---

# Semver debug

When the user is reasoning about version ranges:

1. Call **`semver_satisfies`** with `version` + `range` to confirm a match.
2. Call **`semver_intersect`** with `rangeA` + `rangeB` when combining peer/engine constraints.
3. Call **`semver_expand_min`** with a `range` and `candidates` list to pick the lowest installable version.

## Example prompts

- "Does 1.2.3 satisfy ^1.0.0?"
- "What is the intersection of ^1.2.0 and ~1.3.0?"
- "From these published versions, what is the minimum that satisfies >=1.5 <2?"
