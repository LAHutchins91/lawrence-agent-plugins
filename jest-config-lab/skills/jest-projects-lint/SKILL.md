---
name: jest-projects-lint
description: "List Jest projects and run educational heuristic lite lint with the local zero-auth jest-config-lab MCP. No jest binary, no network."
version: 1.0.0
tags: [jest, jest-config, projects, lint, developer-tools]
---

# Jest projects & lite lint

When the user wants a multi-project inventory or a smell-check of pasted Jest config text:

1. **`jest_projects_list`** — `{ text }` → `{ projects: unknown[], count }`.
   - From `projects` array (path strings or objects with `displayName`).
2. **`jest_lint_lite`** — `{ text }` → `{ findings:[{severity,rule,advice}], findingCount }`.
   - Heuristics: empty config, missing testMatch/testRegex, coverageThreshold
     without collectCoverage, deprecated keys (`testURL`, etc.),
     transformIgnorePatterns tips, JS heuristic limits, package.json jest unwrap.
     Not an exploit guide.

## Example prompts

- "List the Jest projects in this config"
- "Lite-lint this jest.config.js"
- "Any deprecated Jest options here?"
