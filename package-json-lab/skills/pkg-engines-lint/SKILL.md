---
name: pkg-engines-lint
description: >
  Check engines.node against an optional Node version and run educational
  heuristic lite lint on package.json text with the local zero-auth
  package-json-lab MCP. No npm install or network.
version: 1.0.0
tags: [package-json, npm, engines, semver, lint, developer-tools]
---

# Package engines & lite lint

When the user wants engines checks or quick smell checks from **package.json text**:

1. **`pkg_engines_check`** — `{ text, nodeVersion? }` → `{ engines?, satisfies?, notes }`.
   - Simple semver ranges when possible; notes if the range is complex.
2. **`pkg_lint_lite`** — `{ text }` → `{ findings, findingCount }`.
   - Educational heuristics: missing name/version, private+publishConfig,
     `*` ranges, `file:` deps, curl|bash in scripts, deps/devDeps overlap.
     Not an exploit guide.

## Example prompts

- "Does engines.node allow Node 20?"
- "Lite-lint this package.json for common smells"
- "Any star ranges or file: dependencies?"
