---
name: heroku-lint
description: "Lite-lint pasted Heroku app.json for missing name/description, empty scripts, buildpacks present (info), and success_url missing note. Local only, no Heroku API/CLI for tool logic, no fetch."
version: 1.0.0
tags: [heroku, app-json, lint, name, scripts, buildpacks, success-url, local]
---

# Heroku app.json lint

Use **`heroku_lint_lite`** with `configText` on pasted app.json (do not fetch URLs or call Heroku API / `heroku` for analysis):

- Missing `name` (warning)
- Missing `description` (warning)
- `scripts` key exists but empty / no non-empty values (warning)
- `buildpacks` present (info)
- `success_url` missing (info note)

Heuristic only — not Heroku CLI / not schema validation. JSON-only scanner. Never echoes env values.

## Example prompts

- "Lint this app.json for missing name/description."
- "Does this app.json declare buildpacks?"
- "Is success_url set? Are scripts empty?"
