---
name: ng-lint
description: "Lite-lint pasted angular.json for missing defaultProject (legacy), empty/missing projects, builder version-ish notes, and budgets missing on production configuration. Local only, no ng binary for tool logic, no fetch."
version: 1.0.0
tags: [angular, angular-json, lint, budgets, defaultProject, builder, local]
---

# Angular JSON lint

Use **`ng_lint_lite`** with `configText` on pasted angular.json (do not fetch URLs or run `ng` for analysis):

- Missing `defaultProject` (legacy info) / unknown defaultProject (warning)
- No projects (error)
- Builder version-ish notes for classic browser/protractor/Nx smells (info)
- Budgets missing when `configurations.production` exists (warning)

Heuristic only — not Angular CLI / not schema validation. JSON-only scanner.

## Example prompts

- "Lint this angular.json for missing budgets on production."
- "Is defaultProject set in this pasted workspace config?"
- "Any legacy builder notes in this angular.json?"
