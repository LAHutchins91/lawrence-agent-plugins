---
name: render-lint
description: >
  Lite-lint pasted render.yaml for missing services, web without
  healthCheckPath, missing buildCommand, and autoDeploy false (info).
  Local only, no Render API for tool logic, no fetch.
version: 1.0.0
tags: [render, render-yaml, lint, healthcheck, buildCommand, autoDeploy, local]
---

# Render YAML lint

Use **`render_lint_lite`** with `yaml` on pasted render.yaml (do not fetch URLs or call the Render API):

- Missing or empty `services:` (error)
- `type: web` without `healthCheckPath` (warning)
- Missing `buildCommand` (warning)
- `autoDeploy: false` (info)

Heuristic only — not Render CLI / not schema validation. Uses the `yaml` package.

## Example prompts

- "Lint this render.yaml for missing health checks."
- "Is autoDeploy disabled?"
- "Which services lack buildCommand?"
