---
name: vitest-include
description: "Parse pasted vitest.config.*/vite.config.* text locally with zero-auth MCP tools: list test include/exclude globs, coverage provider/reporters/thresholds, and workspace/projects entries. Lite JS/TS scanner — not vitest CLI. No network, no vitest/vite binary."
version: 1.0.0
tags: [vitest, vite, vitest.config, include, exclude, coverage, workspace, parse, local]
---

# Vitest include

Use these tools when the user pastes vitest/vite config text (never fetch a remote config, never run vitest/vite):

1. **`vitest_include_patterns`** with `configText` — → `{include[], exclude[]}` from `test.include` / `test.exclude`.
2. **`vitest_coverage_summary`** with `configText` — → `{provider?, reporters[], thresholds?, present}` from `test.coverage`.
3. **`vitest_workspace_projects`** with `configText` — → `{projects: [{nameOrPath}]}` from `defineWorkspace` / `projects` / workspace arrays.

Lite JS/TS scanner. Input cap ~1MB. Documented limitations apply (not vitest CLI, no full AST).

## Example prompts

- "What include/exclude globs does this vitest.config.ts declare?"
- "Summarize coverage provider, reporters, and thresholds in this pasted config."
- "Which workspace projects are listed in this vitest.workspace.ts?"
