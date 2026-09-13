---
name: gomod-lint
description: >
  Lite-lint pasted go.mod for missing module path, missing go version
  directive, duplicate requires, replace without version notes, and
  retract presence info. Local only, no go CLI, no fetch.
version: 1.0.0
tags: [go, gomod, golang, lint, local]
---

# Go.mod lint

Use **`gomod_lint_lite`** with `gomod` on pasted go.mod (do not fetch URLs or run the go command):

- Missing `module` directive (error)
- Missing `go` version directive (warning)
- Duplicate require paths (warning)
- Replace without a replacement version (info; typical for local `./` / `../` paths)
- `retract` presence (info only — intervals are not evaluated)

Heuristic only — not `go mod tidy` / `go list`. Lite line/block parser.

## Example prompts

- "Lint this go.mod for a missing module or go directive."
- "Are there duplicate requires or version-less replaces in this pasted go.mod?"
- "Does this go.mod retract any versions?"
